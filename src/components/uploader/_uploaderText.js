import {hx, inArray, idxArray} from '../../utils/_tools.js'
import instance from '../../utils/_instance.js'

var getParent = instance.getParent

export default AuUploaderText = Vue.extend({
  computed: {
    uploader: function (){
      return getParent(this, AuUploader)
    }
  },
  render: function (h){
    var me = this
    var $uploader = this.uploader

    var $files = $uploader.files.map(file=>{
      return hx('li.au-uploader-list__item', {
        on: {
          mouseover: function (){
            file.mouseIn = true
          },
          mouseout: function (){
            file.mouseIn = false
          }
        }
      })
      .push(
        hx('au-flex')

        //
        .push(
          hx('au-item', {props:{span:23}})
          .push(
            hx('span.au-uploader-list__item-name')
            .push(
              hx('au-icon', {props:{icon:'file-o'}})
            )
            .push(
              file.name
            )
          )
        )

        //
        .push(
          hx('au-item', {props:{span:1}})
          .push(
            hx('label.au-uploader-list__item-status-label', {
              on: {
                click: function (e){
                  if (file.mouseIn){
                    $uploader.removeFile(file)
                  }

                  e.stopPropagation()
                }
              }
            })

            .push(
              file.mouseIn ? hx('au-icon', {
                props: {
                  icon: 'close'
                }
              }) : null
            )
            
            .push(
              (file.mouseIn || file.isPost) ? null : hx('au-icon', {
                props: {
                  icon: file.isSuccess === false ? 'warning' : 'check'
                }
              })
            )

            .push(
              (!file.mouseIn && file.isPost) ? parseInt(file.percent) : null
            )
          )
        )
      )
    })

    return hx('div.au-uploader')
    .push(
      hx('div.au-uploader-btn')
      .push(
        hx('au-button', {
          props: {
            type:'primay', 
            size:'small'
          },
          on: {
            click: function (e){
              me.$refs.fileInput.value = null
              me.$refs.fileInput.click()
            }
          }
        }, ['点击上传'])
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
    .push(
      hx('div.au-uploader-tip', {}, ['只能上传jpg/png'])
    )
    .push(
      hx('ul.au-uploader-list')
      .push($files)
    )

    .resolve(h)
  }
})

Vue.component('au-uploader-text', AuUploaderText)