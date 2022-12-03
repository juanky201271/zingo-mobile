import React, { ReactNode } from 'react';

import {
  AppStateLoaded,
  SyncStatusReport,
  TotalBalance,
  SendPageState,
  ReceivePageState,
  ToAddr,
  ErrorModalData,
  SendProgress,
  WalletSettings,
} from '../AppState';

const defaultAppState: AppStateLoaded = {
  navigation: null,
  route: null,

  syncStatusReport: new SyncStatusReport(),
  totalBalance: new TotalBalance(),
  addressPrivateKeys: new Map(),
  addresses: [],
  addressBook: [],
  transactions: null,
  sendPageState: new SendPageState(new ToAddr(0)),
  receivePageState: new ReceivePageState(),
  info: null,
  rescanning: false,
  wallet_settings: new WalletSettings(),
  syncingStatus: null,
  errorModalData: new ErrorModalData(),
  txBuildProgress: new SendProgress(),
  walletSeed: null,
  isMenuDrawerOpen: false,
  selectedMenuDrawerItem: '',
  aboutModalVisible: false,
  computingModalVisible: false,
  settingsModalVisible: false,
  infoModalVisible: false,
  rescanModalVisible: false,
  seedViewModalVisible: false,
  seedChangeModalVisible: false,
  seedBackupModalVisible: false,
  seedServerModalVisible: false,
  syncReportModalVisible: false,
  poolsModalVisible: false,
  newServer: null,
  uaAddress: null,

  translate: () => {},
  openErrorModal: () => {},
  closeErrorModal: () => {},
  toggleMenuDrawer: () => {},
  fetchTotalBalance: async () => {},
  setSendPageState: () => {},
  sendTransaction: async () => '',
  clearToAddr: () => {},
  setComputingModalVisible: () => {},
  setTxBuildProgress: () => {},
  syncingStatusMoreInfoOnClick: async () => {},
  poolsMoreInfoOnClick: async () => {},
  doRefresh: () => {},
  startRescan: () => {},
  setUaAddress: () => {},
};

export const ContextLoaded = React.createContext(defaultAppState);

type ContextProviderProps = {
  children: ReactNode;
  value: AppStateLoaded;
};

export const ContextLoadedProvider = ({ children, value }: ContextProviderProps) => {
  return <ContextLoaded.Provider value={value}>{children}</ContextLoaded.Provider>;
};