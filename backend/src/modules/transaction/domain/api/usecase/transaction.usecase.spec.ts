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

describe('TransactionUsecase', () => {
  let transactionUsecase: TransactionUsecase;
  let productServicePort: ProductServicePort;
  let customerServicePort: CustomerServicePort;
  let deliveryServicePort: DeliveryServicePort;
  let transactionPersistencePort: TransactionPersistencePort;
  let transactionStatusPersistencePort: TransactionStatusPersistencePort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionUsecase,
        {
          provide: ProductServicePort,
          useValue: {
            getProductById: jest.fn(),
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
          provide: TransactionPersistencePort,
          useValue: {
            startTransaction: jest.fn(),
            getAllPendingOrderTransactionsByCustomerId: jest.fn(),
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
});
