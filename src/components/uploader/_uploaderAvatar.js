import {hx, inArray, idxArray} from '../../utils/_tools.js'
import instance from '../../utils/_instance.js'

var getParent = instance.getParent

export default AuUploaderAvatar = Vue.extend({
  computed: {
    uploader: function (){
      return getParent(this, AuUploader)
    }
  },
  render: function (h){
    var me = this
    var $uploader = this.uploader

    var file = $uploader.files[0]
    var $file = hx('li.au-uploader-pc-list__item', {
      'class': {
        'au-uploader-pc-list__item-isposting':  file && file.isPosting,
      },
      style: {
        cursor: $uploader.readonly ? 'auto' : 'pointer',
      },
      on: {
        click: function (){
          var $$input = me.$refs.fileInput
          if ($$input){
            $$input.value = null
            $$input.click()
          }
        }
      }
    })

    if (file){
      $file.push(
        !file.isPosting ? hx('img', {
          domProps: {
            src: file.url
          }
        }) : hx('span.au-uploader-list__item-loading', {}, ['上传中...'])
      )
      .push(
        file.isPosting ? hx('div.au-uploader-pc-list__item--percent', {
          style: {
            width: parseInt(file.percent) + '%'
          }
        }) : null
      )
    }
    
    if (!$uploader.readonly){
      $file.push(
        hx('input', {
          domProps: {
            type: 'file',
            accept: $uploader.accept || '',
            multiple: false
          },
          on: {
            change: function ($event){
              var files = $event.target.files
              $uploader.removeFile(file)
              $uploader.uploadFiles(files)
            }
          },
          ref: 'fileInput'
        })
      )
    }

    var $render = hx('div.au-uploader-pc')
    .push(
      hx('ul.au-uploader-pc-list')
      .push($file)
    )

    return $render.resolve(h)
  }
})

Vue.component('au-uploader-avatar', AuUploaderAvatar)