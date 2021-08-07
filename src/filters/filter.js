
import moment from 'moment'
export default {
  dateformat(time) {
    return moment(time).format('YYYY-MM-DD')
  },
  dateformats(time) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  },
  // 项目系统总状态
  stateToName(status) {
    const statusMap = {}
    statusMap[0] = '暂存'
    statusMap[5] = '正在审核'
    statusMap[10] = '通过审核'
    statusMap[-5] = '驳回'
    statusMap[-10] = '彻底驳回'
    return statusMap[status]
  },
  // 审核人员个人状态
  examineStateToName(status) {
    const statusMap = {}
    statusMap[0] = '正在审核'
    statusMap[10] = '通过审核'
    statusMap[-5] = '驳回'
    statusMap[-10] = '彻底驳回'
    return statusMap[status]
  },
  /*
 * 隐藏用户手机号中间四位
 */
  hidePhone(phone) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
}

