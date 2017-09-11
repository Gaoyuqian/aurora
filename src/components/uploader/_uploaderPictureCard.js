import {hx, inArray, idxArray} from '../../utils/_tools.js'
import instance from '../../utils/_instance.js'

var getParent = instance.getParent

export default AuUploaderPictureCard = Vue.extend({
  computed: {
    uploader: function (){
      return getParent(this, AuUploader)
    }
  },
  render: function (h){
    var me = this
    var $uploader = this.uploader

    var $files = $uploader.files.map(file=>{
      return hx('li.au-uploader-pc-list__item', {
        on: {
          click: function (){
            $uploader.onPreview(file)
          }
        }
      })
      .push(
        hx('img', {
          domProps: {
            src: file.url
          }
        })
      )
      .push(
        hx('label.au-uploader-pc-list__item-status-label', {
          on: {
            click: function (e){
              $uploader.removeFile(file)
              e.stopPropagation()
            }
          }
        })
        .push(
          (!file.isPost && file.isSuccess) ? hx('au-icon', {
            props: {
              icon: 'check'
            }
          }) : null
        )
        .push(
          hx('au-icon', {
            props: {
              icon: 'close'
            }
          })
        )
      )
      .push(
        file.isPost ? hx('div.au-uploader-pc-list__item--percent', {
          style: {
            width: parseInt(file.percent) + '%'
          }
        }) : null
      )
    })

    return hx('div.au-uploader-pc')
    .push(
      hx('ul.au-uploader-pc-list')
      .push($files)
    )
    .push(
      hx('div.au-uploader-pc-btn', {
        on: {
          click: function (){
            me.$refs.fileInput.value = null
            me.$refs.fileInput.click()
          }
        }
      })
      .push(
        hx('au-icon', {
          props: {
            icon: 'plus'
          }
        })
      )
      .push(
        hx('input', {
          domProps: {
            type: 'file',
            accept: $uploader.accept || '',
            multiple: $uploader.multiple || false
          },
          on: {
            change: function ($event){
              var files = $event.target.files
              $uploader.uploadFiles(files)
            }
          },
          ref: 'fileInput'
        })
      )
    )
    .resolve(h)
  }
})

Vue.component('au-uploader-picture-card', AuUploaderPictureCard)