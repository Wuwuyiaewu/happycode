import dayjs from 'dayjs'
import { i18n } from '@m/lang'

export const TODAY = dayjs().startOf('day')

export const PROJECTOPTIONS = [
    { text: i18n.t('fundingDetails.projectType.all'), value: '0' },
    { text: i18n.t('fundingDetails.projectType.fundAccess'), value: '1' },
    { text: i18n.t('fundingDetails.projectType.closeProfitAndLoss'), value: '2' },
    { text: i18n.t('fundingDetails.projectType.transactionFee'), value: '3' },
    { text: i18n.t('fundingDetails.projectType.bonus'), value: '4' },
    { text: i18n.t('fundingDetails.projectType.other'), value: '5' },
]

export const FLOWOPTIONS = [
    { text: i18n.t('fundingDetails.flowType.allFlow'), value: '0' },
    { text: i18n.t('fundingDetails.flowType.enterAccount'), value: '1' },
    { text: i18n.t('fundingDetails.flowType.payout'), value: '2' },
]

export const DATEOPTIONS = [
    { text: i18n.t('fundingDetails.dateType.alldates'), value: 1, start: null, end: null },
    { text: i18n.t('fundingDetails.dateType.today'), value: 2, start: TODAY.toDate(), end: TODAY.toDate() },
    { text: i18n.t('fundingDetails.dateType.lastWeek'), value: 3, start: TODAY.subtract(1, 'week').add(1, 'day').toDate(), end: TODAY.toDate() },
    { text: i18n.t('fundingDetails.dateType.lastMonth'), value: 4, start: TODAY.subtract(1, 'month').toDate(), end: TODAY.toDate() },
    { text: i18n.t('fundingDetails.dateType.lastThreeMonths'), value: 5, start: TODAY.subtract(3, 'month').toDate(), end: TODAY.toDate() },
]

const t = currying(_translate)('fundingDetails.accountCapitalType')

export const ACCOUNTCAPITALTYPE = {
    '100': t('deposit'),
    '299': t('rollbackWithdrawal'),
    '102': t('manualDeposit'),
    '200': t('withdraw'),
    '201': t('transferOut'),
    '101': t('transfer'),
    '81': t('commissionForOpeningPositions'),
    '132': t('systemReset'),
    '136': t('adjustZero'),
    '301': t('depositAdjustment'),
    '303': t('cancelWithdrawal'),
    '304': t('handlingFeeAdjustment'),
    '302': t('withdrawalAdjustment'),
    '305': t('systemZeroAdjustment'),
    '306': t('accountTransferAdjustment'),
    '307': t('faultAdjustment'),
    '310': t('bonusBonus'),
    '311': t('bonusdeduction'),
    '313': t('transactionCodeRefund'),
    '312': t('transactionCodeDeduction'),
    '308': t('otherAdjustments'),
    '601': t('taskReward'),
    '137': t('MT4Rebate'),
    '315': t('registrationInvitationBonus'),
    '316': t('registrationInvitationRebate'),
    '317': t('registrationInvitationBonusDeduction'),
    '318': t('bonusPoolBonus'),
    '4': t('closeProfitAndLoss'),
    '5': t('closeProfitAndLoss'),
    '6': t('closeProfitAndLoss'),
    '7': t('closeProfitAndLoss'),
    '8': t('closeProfitAndLoss'),
    '9': t('closeProfitAndLoss'),
    '11': t('closeProfitAndLoss'),
    '17': t('closeProfitAndLoss'),
    '19': t('closeProfitAndLoss'),
    '309': t('signInBonus'),
    '314': t('adjustZero'),
    '360': t('adjust_jk'),
    '361': t('adjust_hk'),
    '362': t('adjust_jklx'),
}

function _translate (path, key) {
    return i18n.t(`${path}.${key}`)
}

function currying (func, args) {
    const leng = func.length
    args = args || []
    return function (..._args) {
        _args.push(...args)
        if (_args.length < leng) {
            return currying.call(this, func, _args)
        }
        return func.apply(this, _args.reverse())
    }
}
