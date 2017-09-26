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
        'class': {
          'au-uploader-pc-list__item-isposting':  file.isPosting,
        },
        on: {
          click: function (){
            if (file.isPosting){
              return
            }
            $uploader.onPreview(file)
          }
        }
      })
      .push(
        !file.isPosting ? hx('img', {
          domProps: {
            src: file.url
          }
        }) : hx('span.au-uploader-list__item-loading', {}, ['上传中...'])
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
          (!file.isPosting && file.isSuccess) ? hx('au-icon', {
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
        file.isPosting ? hx('div.au-uploader-pc-list__item--percent', {
          style: {
            width: parseInt(file.percent) + '%'
          }
        }) : null
      )
    })

    var $render = hx('div.au-uploader-pc')
    .push(
      hx('ul.au-uploader-pc-list')
      .push($files)
    )

    var $uploaderBtn = hx('div.au-uploader-pc-btn', {
      style: {
        display: $uploader.isShowAddBtn ? 'inline-block' : 'none'
      },
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

    return $render.push($uploaderBtn).resolve(h)
  }
})

Vue.component('au-uploader-picture-card', AuUploaderPictureCard)