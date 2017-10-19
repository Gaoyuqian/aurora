import {hx, inArray, idxArray} from '../../utils/_tools.js'
import ajax from './_ajax.js'
import dispatch from '../../mixins/_dispatch'

import './_uploaderText.js'
import './_uploaderPictureCard.js'
import './_uploaderAvatar.js'

export default AuUploader = Vue.extend({
  mixins: [dispatch],
  props: {
    fileList: {
      type: Array,
      default: function (){
        return []
      }
    },
    action: String,
    headers: Object,
    multiple: Boolean,
    data: Object,
    name: {
      type: String,
      default: 'file'
    },
    withCredentials:{
      type: Boolean,
      default: false
    },
    accept: String,
    onPreview: {
      type: Function,
      default: function (){}
    },
    onRemove: {
      type: Function,
      default: function (){}
    },
    onSuccess: {
      type: Function,
      default: function (){}
    },
    onError: {
      type: Function,
      default: function (){}
    },
    onProgress: {
      type: Function,
      default: function (){}
    },
    onChange: {
      type: Function,
      default: function (){}
    },
    beforeUpload: {
      type: Function,
      default: function (){
        return true
      }
    },
    listType: {
      type: String,
      default: 'text',          // text,picture-card
    },
    limit: {
      type: Number,
      default: -1
    },                         // 最大上传数量，-1表示无限
    readonly: Boolean,         // 是否只读
  },
  data: function (){
    return {
      files: []
    }
  },
  created: function (){
    this.files = this.fileList.map(file=>{
      return this.mergeObj(file)
    })
  },
  watch: {
    fileList: function (){
      this.files = this.fileList.map(file=>{
        return this.mergeObj(file)
      })
    }
  },
  computed: {
    isShowAddBtn: function (){
      return (this.limit === -1) || (this.limit > this.files.length)
    }
  },
  methods: {
    mergeObj: function (obj){
      var initObj = {
        name: '',
        url: '',
        rawFile: null,
        isSuccess: true,
        isPosting: false,
        percent: 100,
        mouseIn: false
      }

      for (var o in obj){
        initObj[o] = obj[o]
      }

      return initObj
    },
    uploadFiles: function (files){
      Array.prototype.slice.call(files).forEach(rawFile=>{
        var fileObj = this.mergeObj({
          name: rawFile.name,
          url: URL.createObjectURL(rawFile),
          rawFile: rawFile,
          isSuccess: false,
          isPosting: true,
          percent: 0
        })
        this.upload(fileObj)
      })
    },
    upload: function (file){
      this.files.push(file)

      if (this.beforeUpload(file.rawFile)){
        this.post(file)
      }
    },
    post: function (file){
      var me = this

      var options = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: file.rawFile,
        data: this.data,
        filename: this.name,
        action: this.action,

        onProgress: function (e){
          file.percent = e.percent
          me.onProgress(e, file)
        },
        
        onSuccess: function (res){
          file.isPosting = false
          file.isSuccess = true

          if (res.name){
            file.name = res.name
          }
          if (res.url){
            file.url = res.url
          }

          me.onSuccess(res, file)
          me.dispatch('change.form')
        },
        
        onError: function (err){
          file.isPosting = false
          file.isSuccess = false

          me.removeFile(file)
          me.onError(err, file)
        }
      }

      ajax(options)
    },
    removeFile: function (file){
      var idx = this.files.indexOf(file)
      this.files.splice(idx, 1)
      this.onRemove(file)
      this.dispatch('change.form')
    },
    getFiles: function (){
      var files = []
      this.files.forEach(file=>{
        files.push({
          name: file.name,
          url: file.url
        })
      })
      return files
    }
  },
  render: function (h){
    var componentName = 'au-uploader-text'

    if (this.listType === 'picture-card'){
      componentName = 'au-uploader-picture-card'
    }
    else if (this.listType === 'avatar'){
      componentName = 'au-uploader-avatar'
    }

    return hx(componentName).resolve(h)
  }
})

Vue.component('au-uploader', AuUploader)