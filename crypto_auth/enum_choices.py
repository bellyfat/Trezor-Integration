from enum import Enum


class WithdrawStatus(Enum):
    PENDING = 'Pending'
    REJECTED = 'Rejected'
    SUCCESS = 'Success'

    @classmethod
    def all(self):
        return [WithdrawStatus.PENDING, WithdrawStatus.REJECTED, WithdrawStatus.SUCCESS]


class Network(Enum):
    MAINNET = 'https://etherscan.io/'
    RINKEBY = 'https://rinkeby.etherscan.io/'

    @classmethod
    def all(self):
        return [Network.MAINNET, Network.RINKEBY]


class NetworkName(Enum):
    MAINNET = 'mainnet'
    RINKEBY = 'rinkeby'

    @classmethod
    def all(self):
        return [NetworkName.MAINNET, NetworkName.RINKEBY]


class TransactionType(Enum):
    CREDIT = 'Credit'
    DEBIT = 'Debit'
    FEE = 'Fee'

    @classmethod
    def all(self):
        return [TransactionType.CREDIT, TransactionType.DEBIT, TransactionType.FEE]
