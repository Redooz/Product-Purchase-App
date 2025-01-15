import { Test, TestingModule } from '@nestjs/testing';
import { TransactionUsecase } from './transaction.usecase';
import { ProductServicePort } from '@/product/domain/api/product.service.port';
import { CustomerServicePort } from '@/customer/domain/api/customer.service.port';
import { DeliveryServicePort } from '@/modules/delivery/domain/api/delivery.service.port';
import { TransactionPersistencePort } from '@/transaction/domain/spi/transaction.persistence.port';
import { TransactionStatusPersistencePort } from '@/transaction/domain/spi/transaction.status.persistence.port';
import { ProductQuantityNotAvailableError } from '@/transaction/domain/exception/product.quantity.not.available.error';
import { OrderTransaction } from '@/transaction/domain/model/order.transaction';
import { Product } from '@/product/domain/model/product';
import { Delivery } from '@/modules/delivery/domain/model/delivery';
import { Status } from '@/transaction/domain/model/enum/status';
import { AcceptanceServicePort } from '@/transaction/domain/spi/acceptance.service.port';
import { PaymentGatewayServicePort } from '@/transaction/domain/spi/payment.gateway.service.port';
import { Acceptance } from '@/transaction/domain/model/acceptance';
import { AcceptanceType } from '@/transaction/domain/model/enum/acceptance.type';
import { Card } from '@/transaction/domain/model/card';
import { TransactionAlreadyFinishedError } from '@/transaction/domain/exception/transaction.already.finished.error';
import { TransactionNotFoundError } from '@/transaction/domain/exception/transaction.not.found.error';
import { PaymentStatus } from '@/transaction/domain/model/enum/payment.status';

describe('TransactionUsecase', () => {
  let productServicePort: ProductServicePort;
  let customerServicePort: CustomerServicePort;
  let deliveryServicePort: DeliveryServicePort;
  let acceptanceServicePort: AcceptanceServicePort;
  let paymentGatewayServicePort: PaymentGatewayServicePort;
  let transactionPersistencePort: TransactionPersistencePort;
  let transactionStatusPersistencePort: TransactionStatusPersistencePort;

  let transactionUsecase: TransactionUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionUsecase,
        {
          provide: ProductServicePort,
          useValue: {
            getProductById: jest.fn(),
            updateProductStock: jest.fn(),
          },
        },
        {
          provide: CustomerServicePort,
          useValue: {
            getCustomerById: jest.fn(),
          },
        },
        {
          provide: DeliveryServicePort,
          useValue: {
            createDelivery: jest.fn(),
          },
        },
        {
          provide: AcceptanceServicePort,
          useValue: {
            getAllPresignedAcceptances: jest.fn(),
          },
        },
        {
          provide: PaymentGatewayServicePort,
          useValue: {
            pay: jest.fn(),
          },
        },
        {
          provide: TransactionPersistencePort,
          useValue: {
            startTransaction: jest.fn(),
            getAllPendingOrderTransactionsByCustomerId: jest.fn(),
            getTransactionById: jest.fn(),
            updateOrderTransaction: jest.fn(),
            deleteOrderTransaction: jest.fn(),
          },
        },
        {
          provide: TransactionStatusPersistencePort,
          useValue: {
            getTransactionStatusByName: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionUsecase = module.get<TransactionUsecase>(TransactionUsecase);
    productServicePort = module.get<ProductServicePort>(ProductServicePort);
    customerServicePort = module.get<CustomerServicePort>(CustomerServicePort);
    deliveryServicePort = module.get<DeliveryServicePort>(DeliveryServicePort);
    acceptanceServicePort = module.get<AcceptanceServicePort>(
      AcceptanceServicePort,
    );
    paymentGatewayServicePort = module.get<PaymentGatewayServicePort>(
      PaymentGatewayServicePort,
    );

    transactionPersistencePort = module.get<TransactionPersistencePort>(
      TransactionPersistencePort,
    );
    transactionStatusPersistencePort =
      module.get<TransactionStatusPersistencePort>(
        TransactionStatusPersistencePort,
      );
  });

  it('should start a transaction successfully', async () => {
    // Arrange
    const pendingTransaction: OrderTransaction = {
      customer: { id: 1 },
      product: { id: 1 },
      quantity: 2,
      delivery: { fee: 0 },
      total: 0,
      status: null,
    } as OrderTransaction;
    const customer = { id: 1 };
    const product: Product = { id: 1, stock: 10, price: 100 } as Product;
    const delivery: Delivery = { fee: 5 } as Delivery;
    const presignedAcceptances: Acceptance[] = [
      {
        type: AcceptanceType.END_USER_POLICY,
        acceptanceToken: 'token',
        permalink: 'permalink',
      },
      {
        type: AcceptanceType.PERSONAL_DATA_AUTHORIZATION,
        acceptanceToken: 'token',
        permalink: 'permalink',
      },
    ];
    const status = { name: Status.PENDING };

    jest
      .spyOn(customerServicePort, 'getCustomerById')
      .mockResolvedValue(customer);
    jest.spyOn(productServicePort, 'getProductById').mockResolvedValue(product);
    jest
      .spyOn(transactionStatusPersistencePort, 'getTransactionStatusByName')
      .mockResolvedValue(status);
    jest
      .spyOn(deliveryServicePort, 'createDelivery')
      .mockResolvedValue(delivery);
    jest
      .spyOn(transactionPersistencePort, 'startTransaction')
      .mockResolvedValue(pendingTransaction);
    jest
      .spyOn(acceptanceServicePort, 'getAllPresignedAcceptances')
      .mockResolvedValue(presignedAcceptances);

    // Act
    const result =
      await transactionUsecase.startTransaction(pendingTransaction);

    // Assert
    expect(result.transaction).toEqual(pendingTransaction);
    expect(result.delivery).toEqual(delivery);
  });

  it('should throw ProductQuantityNotAvailableError if product quantity is not available', async () => {
    // Arrange
    const pendingTransaction: OrderTransaction = {
      customer: { id: 1 },
      product: { id: 1 },
      quantity: 20,
      delivery: { fee: 0 },
      total: 0,
      status: null,
    } as OrderTransaction;
    const product: Product = { id: 1, stock: 10, price: 100 } as Product;

    jest.spyOn(productServicePort, 'getProductById').mockResolvedValue(product);

    // Act & Assert
    await expect(
      transactionUsecase.startTransaction(pendingTransaction),
    ).rejects.toThrow(ProductQuantityNotAvailableError);
  });

  it('should get all pending order transactions by customer id', async () => {
    // Arrange
    const customerId = 1;
    const pendingOrderTransactions: Partial<OrderTransaction>[] = [
      {
        id: 1,
        quantity: 2,
        total: 200,
        delivery: {
          id: 1,
          personName: '',
          address: '',
          country: '',
          city: '',
          postalCode: '',
          region: '',
          phoneNumber: '',
        },
      },
    ];
    jest
      .spyOn(
        transactionPersistencePort,
        'getAllPendingOrderTransactionsByCustomerId',
      )
      .mockResolvedValue(pendingOrderTransactions);

    // Act
    const result =
      await transactionUsecase.getAllPendingOrderTransactionsByCustomerId(
        customerId,
      );

    // Assert
    expect(result[0].id).toEqual(pendingOrderTransactions[0].id);
  });

  it('should finish a transaction with card successfully', async () => {
    const transactionId = 1;
    const card: Card = {
      number: '4242424242424242',
      cvc: '123',
      expMonth: '08',
      expYear: '28',
      cardHolder: 'José Pérez',
    };
    const transaction: OrderTransaction = {
      id: transactionId,
      customer: { id: 1 },
      product: { id: 1, stock: 10, price: 100 },
      quantity: 2,
      total: 200,
      delivery: { fee: 5 },
      status: { id: 1, name: Status.PENDING },
      createdAt: new Date(),
    } as OrderTransaction;
    const paymentResult = {
      id: 'paymentId',
      status: PaymentStatus.APPROVED,
    };

    jest
      .spyOn(transactionPersistencePort, 'getTransactionById')
      .mockResolvedValue(transaction);
    jest
      .spyOn(paymentGatewayServicePort, 'pay')
      .mockResolvedValue(paymentResult);
    jest
      .spyOn(transactionStatusPersistencePort, 'getTransactionStatusByName')
      .mockResolvedValue({
        id: 2,
        name: Status.APPROVED,
      });
    jest
      .spyOn(productServicePort, 'updateProductStock')
      .mockResolvedValue(undefined);
    jest
      .spyOn(transactionPersistencePort, 'updateOrderTransaction')
      .mockResolvedValue(transaction);

    const result = await transactionUsecase.finishTransactionWithCard(
      transactionId,
      card,
    );

    expect(result).toEqual(transaction);
    expect(result.status.name).toBe(Status.APPROVED);
    expect(result.paymentGatewayTransactionId).toBe(paymentResult.id);
  });

  it('should throw TransactionNotFoundError if transaction does not exist', async () => {
    const transactionId = 999;
    const card: Card = {
      number: '4242424242424242',
      cvc: '123',
      expMonth: '08',
      expYear: '28',
      cardHolder: 'José Pérez',
    };

    jest
      .spyOn(transactionPersistencePort, 'getTransactionById')
      .mockResolvedValue(null);

    await expect(
      transactionUsecase.finishTransactionWithCard(transactionId, card),
    ).rejects.toThrow(TransactionNotFoundError);
  });

  it('should throw TransactionAlreadyFinishedError if transaction is not pending', async () => {
    const transactionId = 1;
    const card: Card = {
      number: '4242424242424242',
      cvc: '123',
      expMonth: '08',
      expYear: '28',
      cardHolder: 'José Pérez',
    };
    const transaction: OrderTransaction = {
      id: transactionId,
      customer: { id: 1 },
      product: { id: 1, stock: 10, price: 100 },
      quantity: 2,
      total: 200,
      delivery: { fee: 5 },
      status: { id: 2, name: Status.APPROVED },
      createdAt: new Date(),
    } as OrderTransaction;

    jest
      .spyOn(transactionPersistencePort, 'getTransactionById')
      .mockResolvedValue(transaction);

    await expect(
      transactionUsecase.finishTransactionWithCard(transactionId, card),
    ).rejects.toThrow(TransactionAlreadyFinishedError);
  });

  it('should throw ProductQuantityNotAvailableError if product quantity is not available', async () => {
    const transactionId = 1;
    const card: Card = {
      number: '4242424242424242',
      cvc: '123',
      expMonth: '08',
      expYear: '28',
      cardHolder: 'José Pérez',
    };
    const transaction: OrderTransaction = {
      id: transactionId,
      customer: { id: 1 },
      product: { id: 1, stock: 1, price: 100 },
      quantity: 2,
      total: 200,
      delivery: { fee: 5 },
      status: { id: 1, name: Status.PENDING },
      createdAt: new Date(),
    } as OrderTransaction;

    jest
      .spyOn(transactionPersistencePort, 'getTransactionById')
      .mockResolvedValue(transaction);

    await expect(
      transactionUsecase.finishTransactionWithCard(transactionId, card),
    ).rejects.toThrow(ProductQuantityNotAvailableError);
  });

  it('should delete a transaction successfully', async () => {
    // Arrange
    const transactionId = 1;
    const customerId = 1;
    const transaction: OrderTransaction = {
      id: transactionId,
      customer: { id: customerId },
      product: { id: 1, stock: 10, price: 100 },
      quantity: 2,
      total: 200,
      delivery: { fee: 5 },
      status: { id: 1, name: Status.PENDING },
      createdAt: new Date(),
    } as OrderTransaction;

    jest
      .spyOn(transactionPersistencePort, 'getTransactionById')
      .mockResolvedValue(transaction);

    // Act
    await transactionUsecase.deleteOrderTransaction(transactionId, customerId);

    // Assert
    expect(
      transactionPersistencePort.deleteOrderTransaction,
    ).toHaveBeenCalledWith(transactionId);
  });

  it('should throw TransactionNotFoundError if transaction does not exist', async () => {
    // Arrange
    const transactionId = 999;
    const customerId = 1;

    jest
      .spyOn(transactionPersistencePort, 'getTransactionById')
      .mockResolvedValue(null);

    // Act & Assert
    await expect(
      transactionUsecase.deleteOrderTransaction(transactionId, customerId),
    ).rejects.toThrow(TransactionNotFoundError);
  });

  it('should throw TransactionNotFoundError if transaction does not belong to customer', async () => {
    // Arrange
    const transactionId = 1;
    const customerId = 999;
    const transaction: OrderTransaction = {
      id: transactionId,
      customer: { id: 1 },
      product: { id: 1, stock: 10, price: 100 },
      quantity: 2,
      total: 200,
      delivery: { fee: 5 },
      status: { id: 1, name: Status.PENDING },
      createdAt: new Date(),
    } as OrderTransaction;

    jest
      .spyOn(transactionPersistencePort, 'getTransactionById')
      .mockResolvedValue(transaction);

    // Act & Assert
    await expect(
      transactionUsecase.deleteOrderTransaction(transactionId, customerId),
    ).rejects.toThrow(TransactionNotFoundError);
  });

  it('should throw TransactionAlreadyFinishedError if transaction is not pending', async () => {
    // Arrange
    const transactionId = 1;
    const customerId = 1;
    const transaction: OrderTransaction = {
      id: transactionId,
      customer: { id: customerId },
      product: { id: 1, stock: 10, price: 100 },
      quantity: 2,
      total: 200,
      delivery: { fee: 5 },
      status: { id: 2, name: Status.APPROVED },
      createdAt: new Date(),
    } as OrderTransaction;

    jest
      .spyOn(transactionPersistencePort, 'getTransactionById')
      .mockResolvedValue(transaction);

    // Act & Assert
    await expect(
      transactionUsecase.deleteOrderTransaction(transactionId, customerId),
    ).rejects.toThrow(TransactionAlreadyFinishedError);
  });
});
