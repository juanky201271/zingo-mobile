/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { View, ScrollView, Image, Modal, TouchableOpacity, RefreshControl } from 'react-native';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import { useTheme } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faInfo } from '@fortawesome/free-solid-svg-icons';

import RPC from '../../app/rpc';
import { Transaction } from '../../app/AppState';
import { ThemeType } from '../../app/types';
import RegText from '../Components/RegText';
import ZecAmount from '../Components/ZecAmount';
import UsdAmount from '../Components/UsdAmount';
import FadeText from '../Components/FadeText';
import Button from '../Button';
import TxDetail from './components/TxDetail';
import TxSummaryLine from './components/TxSummaryLine';
import { ContextLoaded } from '../../app/context';

const Transactions: React.FunctionComponent = () => {
  const context = useContext(ContextLoaded);
  const {
    translate,
    toggleMenuDrawer,
    transactions,
    totalBalance,
    setComputingModalVisible,
    info,
    syncingStatus,
    poolsMoreInfoOnClick,
    syncingStatusMoreInfoOnClick,
    doRefresh,
  } = context;
  const { colors } = useTheme() as unknown as ThemeType;
  const [isTxDetailModalShowing, setTxDetailModalShowing] = React.useState(false);
  const [txDetail, setTxDetail] = React.useState<Transaction | null>(null);

  const [numTx, setNumTx] = React.useState<number>(100);
  const loadMoreButton = numTx < (transactions?.length || 0);

  const loadMoreClicked = () => {
    setNumTx(numTx + 100);
  };

  const showShieldButton = totalBalance && totalBalance.transparentBal > 0;
  const shieldFunds = async () => {
    setComputingModalVisible(true);

    const shieldStr = await RPC.rpc_shieldTransparent();

    setComputingModalVisible(false);
    if (shieldStr) {
      setTimeout(() => {
        const shieldJSON = JSON.parse(shieldStr);

        if (shieldJSON.error) {
          Toast.show(`${translate('transactions.shield-error')} ${shieldJSON.error}`, Toast.LONG);
        } else {
          Toast.show(`${translate('transactions.shield-message')} ${shieldJSON.txid}`);
        }
      }, 1000);
    }
  };

  const zecPrice = info ? info.zecPrice : null;

  const syncStatusDisplayLine = syncingStatus?.inProgress ? `(${syncingStatus?.blocks})` : '';

  const balanceColor = transactions?.find(t => t.confirmations === 0) ? colors.primary : colors.text;
  var lastMonth = '';

  //console.log('render transaction view');

  return (
    <View
      accessible={true}
      accessibilityLabel={translate('transactions.title-acc')}
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: 140,
        width: '100%',
      }}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isTxDetailModalShowing}
        onRequestClose={() => setTxDetailModalShowing(false)}>
        <TxDetail tx={txDetail} closeModal={() => setTxDetailModalShowing(false)} />
      </Modal>

      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingBottom: 0,
          backgroundColor: colors.card,
          zIndex: -1,
          paddingTop: 10,
        }}>
        <Image
          source={require('../../assets/img/logobig-zingo.png')}
          style={{ width: 80, height: 80, resizeMode: 'contain' }}
        />
        <View style={{ flexDirection: 'row' }}>
          <ZecAmount
            currencyName={info?.currencyName ? info.currencyName : ''}
            color={balanceColor}
            size={36}
            amtZec={totalBalance.total}
          />
          {totalBalance.total > 0 && (totalBalance.privateBal > 0 || totalBalance.transparentBal > 0) && (
            <TouchableOpacity onPress={() => poolsMoreInfoOnClick()}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.card,
                  borderRadius: 10,
                  margin: 0,
                  padding: 0,
                  marginLeft: 5,
                  minWidth: 48,
                  minHeight: 48,
                }}>
                <RegText color={colors.primary}>{translate('transactions.pools')}</RegText>
                <FontAwesomeIcon icon={faInfo} size={14} color={colors.primary} />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <UsdAmount style={{ marginTop: 0, marginBottom: 5 }} price={zecPrice} amtZec={totalBalance.total} />

        {showShieldButton && (
          <View style={{ margin: 5 }}>
            <Button type="Primary" title={translate('transactions.shieldfunds')} onPress={shieldFunds} />
          </View>
        )}

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginVertical: syncStatusDisplayLine ? 0 : 5,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
            <RegText color={colors.money} style={{ paddingHorizontal: 5 }}>
              {syncStatusDisplayLine ? translate('transactions.title-syncing') : translate('transactions.title')}
            </RegText>
            {!!syncStatusDisplayLine && <FadeText style={{ margin: 0, padding: 0 }}>{syncStatusDisplayLine}</FadeText>}
          </View>
          {!!syncStatusDisplayLine && (
            <TouchableOpacity onPress={() => syncingStatusMoreInfoOnClick()}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.card,
                  borderRadius: 10,
                  margin: 0,
                  padding: 0,
                  marginLeft: 5,
                  minWidth: 48,
                  minHeight: 48,
                }}>
                <RegText color={colors.primary}>{translate('transactions.more')}</RegText>
                <FontAwesomeIcon icon={faInfo} size={14} color={colors.primary} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ backgroundColor: colors.card, padding: 10, position: 'absolute' }}>
        <TouchableOpacity accessible={true} accessibilityLabel={translate('menudrawer-acc')} onPress={toggleMenuDrawer}>
          <FontAwesomeIcon icon={faBars} size={48} color={colors.border} />
        </TouchableOpacity>
      </View>

      <View style={{ width: '100%', height: 1, backgroundColor: colors.primary }} />

      <ScrollView
        accessible={true}
        accessibilityLabel={translate('transactions.list-acc')}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={doRefresh}
            tintColor={colors.text}
            title={translate('transactions.refreshing')}
          />
        }
        style={{ flexGrow: 1, marginTop: 10, width: '100%', height: '100%' }}>
        {transactions
          ?.slice(0, numTx)
          .sort((a, b) => b.time - a.time)
          .flatMap(t => {
            let txmonth = moment(t.time * 1000).format('MMM YYYY');

            var month = '';
            if (txmonth !== lastMonth) {
              month = txmonth;
              lastMonth = txmonth;
            }

            return (
              <TxSummaryLine
                key={`${t.txid}-${t.type}`}
                tx={t}
                month={month}
                setTxDetail={setTxDetail}
                setTxDetailModalShowing={setTxDetailModalShowing}
              />
            );
          })}
        {!!transactions && !!transactions.length && (
          <View style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <FadeText style={{ color: colors.primary }}>{translate('transactions.end')}</FadeText>
          </View>
        )}

        {loadMoreButton && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 30 }}>
            <Button type="Secondary" title={translate('transactions.loadmore')} onPress={loadMoreClicked} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Transactions;
