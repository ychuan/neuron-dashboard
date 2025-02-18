import { ref } from 'vue'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { EmqxMessage, EmqxMessageBox } from '@emqx/emqx-ui'
import { addPlugin, deletePlugin, queryPluginList } from '@/api/config'
import { createCommonErrorMessage } from '@/utils/utils'
// import { PluginType } from '@/types/enums'
import type { CreatedPlugin, PluginForm } from '@/types/config'
// import useLang from '@/composables/useLang'

export default () => {
  const pluginList: Ref<Array<CreatedPlugin>> = ref([])
  const isListLoading = ref(false)

  // const { currentLang } = useLang()
  // if add a new plugin, please add document suffix to `PluginType` on the 'enum.ts'.
  // const pluginTypeMapping = computed(() => (pluginName: string) => {
  //   if (!pluginName) return ''
  //   const types = new Map([
  //     [/^mitsubishi1e[\s\S]*$/, PluginType.A1E],
  //     [/^beckhoffads[\s\S]*$/, PluginType.ADS],
  //     [/^bacnet[\s\S]*$/, PluginType.BACnetIP],
  //     [/^dlt645[\s\S]*$/, PluginType.DLT6452007],
  //     [/^ethernet\/ip[\s\S]*$/, PluginType.EthernetIp],
  //     [/[\s\S]fins[\s\S]*$/, PluginType.OmronFinsOnTCP],
  //     [/[\s\S]focas[\s\S]*$/, PluginType.Focas],
  //     [/^iec60870-5-104[\s\S]*$/, PluginType.IEC608705104],
  //     [/^knx[\s\S]*$/, PluginType.KNXnetIP],
  //     [/^mqtt[\s\S]*$/, PluginType.MQTT],
  //     [/^modbus[\s\S]*$/, PluginType.Modbus],
  //     [/^nona11[\s\S]*$/, currentLang.value === 'zh' ? PluginType.zhNoA11 : PluginType.enNoA11],
  //     [/^opcua[\s\S]*$/, PluginType.OPCUA],
  //     [/^mitsubishi3e[\s\S]*$/, PluginType.MitsubishiMelsecQE71],
  //     [/^siemenss7isotcp[\s\S]*$/, PluginType.SiemensS7ISOTCP],
  //     [/^sparkplugb[\s\S]*$/, PluginType.SparkplugB],
  //   ])
  //   const lowerName = pluginName.replace(/\s/g, '').toLocaleLowerCase()
  //   const typeKV = [...types].filter(([key, value]) => key.test(`${lowerName}`))
  //   const res = typeKV.length ? typeKV[0][1].toLocaleLowerCase().replace(/\s+/g, '-') : ''
  //   return res
  // })

  // const pluginLinkURL = computed(() => (pluginName: string) => {
  //   const pluginType = pluginTypeMapping.value(pluginName)
  //   const pluginlink = `https://neugates.io/docs/${currentLang.value}/latest/module-plugins/module-driver.html#${pluginType}`
  //   return pluginType ? pluginlink : ''
  // })

  const getPluginList = async () => {
    isListLoading.value = true
    const { data } = await queryPluginList()
    pluginList.value = data.plugins.length
      ? data.plugins.map((item) => {
          return {
            ...item,
            // doc_link: pluginLinkURL.value(item.name),
          }
        })
      : []
    isListLoading.value = false
  }

  getPluginList()

  return {
    pluginList,
    isListLoading,
    getPluginList,
  }
}

export const useGetPluginMsgIdMap = () => {
  const pluginMsgIdMap: Record<string, CreatedPlugin> = {}
  const initMsgIdMap = async () => {
    try {
      const { data } = await queryPluginList()
      ;(data.plugins || []).forEach((item) => {
        pluginMsgIdMap[item.name] = item
      })
      return Promise.resolve(pluginMsgIdMap)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { pluginMsgIdMap, initMsgIdMap }
}

export const useAddPlugin = () => {
  const createRawPluginForm = (): PluginForm => ({
    library: '',
  })
  const { t } = useI18n()
  const pluginForm = ref(createRawPluginForm())
  const pluginFormCom = ref()
  const pluginFormRules = {
    library: [
      {
        required: true,
        message: createCommonErrorMessage('input', t('config.libName')),
      },
    ],
  }
  const isSubmitting = ref(false)

  const submitData = async () => {
    try {
      await pluginFormCom.value.validate()
      isSubmitting.value = true
      await addPlugin(pluginForm.value)
      EmqxMessage.success(t('common.createSuccess'))
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    pluginForm,
    pluginFormCom,
    pluginFormRules,
    isSubmitting,
    createRawPluginForm,
    submitData,
  }
}

export const useDeletePlugin = () => {
  const { t } = useI18n()
  const delPlugin = async ({ name }: CreatedPlugin) => {
    try {
      await EmqxMessageBox({
        title: t('common.operateConfirm'),
        message: t('common.confirmDelete'),
        type: 'warning',
        confirmButtonText: t('common.confirmButtonText'),
      })
      await deletePlugin(name)
      EmqxMessage.success(t('common.operateSuccessfully'))
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }
  return {
    delPlugin,
  }
}

export const usePluginIcon = () => {
  const pluginIconMap: Record<string, string> = {
    ekuiper: require('@/assets/images/plugin-icons/ekuiper.svg'),
    mqtt: require('@/assets/images/plugin-icons/MQTT.png'),
    'modbus-tcp': require('@/assets/images/plugin-icons/modbus.svg'),
  }
  const getPluginIcon = (name: string) => pluginIconMap[name] || ''

  return {
    getPluginIcon,
  }
}
