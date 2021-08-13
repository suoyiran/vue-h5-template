<!--  -->
<template>
  <div>
    <Header />
    <div>
      <div class="imgexcl">
        <van-search
          shape="round"
          v-model="searchParame.name"
          placeholder="请输入搜索关键词"
        />
        <van-button
          round
          icon='search'
          type="info"
          color="linear-gradient(to right, #5DC3FE, #0079DF)"
          @click="searchData"
        >搜索</van-button>
      </div>
      <div class="audit_neo">
        <div
          class="audtim"
          v-for="(item,inx) in items"
          :key='inx'
        >
          <div class="audtim_fi">
            <div><b >{{item.name}}</b></div>
            <div class="qiaall">
              <div class="audtim_bt">
                <i class="iconfont iconshijian1"></i><span>{{item.createdAt | dateformat}}</span>
              </div>
              <div class="aisbox">
                <van-button
                v-if='item.status !== 5'
                  class="qiaall_s qiaall_xiu"
                  @click="edit(item)"
                ><i class="iconfont iconicon"></i>编辑</van-button>
                <van-button
                v-if='item.status === 5'
                  class="qiaall_s qiaall_che"
                  @click="recall(item)"
                ><i class="iconfont iconchehui"></i>撤回</van-button>
                <van-button
                  class="qiaall_s qiaall_shan"
                  @click="delt(item)"
                ><i class="iconfont iconshanchu"></i>删除</van-button>
            </div>
            </div>
          </div>
          <p>
            <span>{{item.data.background}}</span>
          </p>
        </div>
      </div>
      <div class="paginas">
        <van-pagination
          force-ellipses
          v-model="nowPage"
          :page-count="page_count"
          :total-items="numberOfElements"
          :show-page-size="3"
        >
          <template #prev-text>
            <van-icon name="arrow-left" />
          </template>
          <template #next-text>
            <van-icon name="arrow" />
          </template>
          <template #page="{ text }">{{ text }}</template>
        </van-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import httpClient from '../../utils/request'
import Header from '@/components/Header'
import {
  Toast,
  Dialog
} from 'vant'
export default {
  components: {
    Header
    // TabBar
  },
  data() {
    return {
      searchParame: {
        page: 0,
        size: 15,
        formId: 'f763c8ae-776d-4833-b7f7-3e4450925814'
      },
      items: [],
      page_count: '',
      number: 0,
      nowPage: 1,
      numberOfElements: 15
    }
  },
  watch: {
    'nowPage': function(val) {
      this.searchParame.page = val - 1
      this.searchData()
      console.log(val)
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path === '/home') {
        vm._data.nowPage = 1
      }
    })
  },
  async activated() {
    console.log('activated', this.$route.meta.keepAlive)
    this.searchParame.formId = this.$route.query.formId
    await this.searchData()
  },
  methods: {
    callPhone(tel) {
      location.href = `tel:${tel}`
    },
    // 挑详情
    detail(id, formId) {
      if (id === 'stop') {
        return
      }
      this.$router.push({
        path: '/home/details2/' + id,
        query: {
          name: '锚点',
          formId: formId,
          id: id
        }
      })
    },
    // 点击搜索
    async searchData() {
      const searchParame = this.searchParame
      const resp = await httpClient.get('/reports/query', {
        params: searchParame // 搜索参数对象
      })
      if (resp.code !== 200) {
        return
      }
      this.page_count = resp.data.totalPages
      this.numberOfElements = resp.data.totalElements
      this.number = resp.data.number
      this.items = resp.data.content
      if (!resp.data.totalPages > 0) {
        Toast('未搜索到数据')
      }
    },
    // 删除项目
    delt(item) {
      Dialog.confirm({
        title: '你确定要删除 "' + item.name + '" 吗？',
        message: '删除后将无法恢复。'
      })
        .then(() => {
          httpClient.delete('/reports/' + item.id)
            .then(() => {
              this.searchData()
              setTimeout(() => {
                Toast('删除成功!')
              }, 500)
            })
            .catch((error) => {
              console.log(error)
              Toast('删除失败!')
            })
        })
        .catch(() => { })
    },
    recall(item) {
      httpClient.put(`reports/${item.id}/recall`)
        .then(() => {
          Toast('撤回成功')
          this.$router.go(0)
        }).catch((error) => {
          Toast(error)
        })
    },
    edit(item) {
      this.$router.push({
        path: '/report',
        query: {
          formId: item.formId,
          id: item.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.audit_neo {
  position: relative;
  margin: 0 15px;
}

.audtim {
  background-color: #fff;
  margin: 15px 0;
  padding: 15px;
  box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.08);
  border-radius: 10px;

  .audtim_fi {
    padding-bottom: 10px;
    border-bottom: 1px solid #e6e6e6;
    b {
      font-size: 16px;
      line-height: 23px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      color: #009cf5;
    }
  }
  p {
    span {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      text-align: left;
      color: #666666;
      line-height: 23px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }

  .audtim_bt {
    i {
      color: #6cc1dc;
      font-size: 14px;
      padding-right: 4px;
    }
    span {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      color: #666666;
    }
    .van-button {
      margin-left: 7px;
      padding: 0 10px;
      width: 65px;
      height: 20px;
      background: rgba(85, 193, 136, 0.1);
      i {
        padding: 0;
        color: #55c188;
      }
      span {
        font-size: 11px;
        font-family: PingFang SC, PingFang SC-Medium;
        font-weight: 500;
        text-align: left;
        color: #55c188;
      }
    }
  }
}

.imgexcl {
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  background-color: #fff;

  .van-button--info {
    height: 30px;
    padding: 0 15px;

    .van-button__text {
      color: #fff;
      font-size: 14px;
    }
  }
}

.qiaall {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  .qiaall_s{
    line-height: 30px;
    span {
      color: #fff;
      border-radius: 11px;
      padding: 0 8px;
      height: 30px;
      font-size: 13px;
    }
    i {
      font-size: 12px;
      padding-right: 2px;
    }

  }
  .qiaall_shan {
    span {
      background: #fa4f63;
    }
  }

  .qiaall_xiu {
    span {
      background: #07c160;
    }
  }
  .qiaall_che{
    span{
      background: #f5d33c;
    }
  }

  .van-button--normal {
    background: #f8f8fa;
    margin-left: 10px;
    height: 20px;
    padding: 12px 0;
    border: none;
  }
}

::v-deep .van-search {
  padding: 10px 10px 10px 0;
  width: 260px;
}

.paginas {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 375px;
  height: 35px;
  position: fixed;
  bottom: 20px;
  z-index: 9;
}
::v-deep .van-searchParame {
  background-color: #fff;
  height: 28px;
  opacity: 1;
}
::v-deep .van-searchParame__item {
  height: 28px;
}
.listProblem {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  position: fixed;
  z-index: 9999;
  bottom: 80px;
  opacity: 0.9;
  right: 20px;
  background-color: #f5b925;
  text-align: center;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  p {
    position: relative;
  }
  .lie1 {
    top: 4px;
  }
  .lie2 {
    top: -15px;
  }
}
::v-deep .v-application ol,
.v-application ul {
  padding-left: 0;
}
</style>
