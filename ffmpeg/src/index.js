import fs from 'fs'
import path from 'path'
import axios from 'axios'
(async function () {
  const checkPath = async function (path) {
    try {
      await fs.promises.access(path)
    } catch {
      fs.mkdirSync(path)
    }
    return true
  }

  const basePath = './video'
  await checkPath(basePath)


  const config = {
    headers:
    {
      Authorization: 'Bearer pc:b9c54d500ec056c68a0bd06cf9b04670',
      cookie: 'gr_user_id=e3537e02-53f9-47c2-ab79-1d5e155c760f; kd_user_id=3fafee7b-7e18-4080-9cb1-6982ba8f3ed5; sensorsdata2015jssdkcross={"distinct_id":"5011350","first_id":"17d1826c2f710ff-095bdd71fd0cda8-1c306851-5089536-17d1826c2f81457","props":{"$latest_traffic_source_type":"直接流量","$latest_search_keyword":"未取到值_直接打开","$latest_referrer":""},"$device_id":"17d1826c2f710ff-095bdd71fd0cda8-1c306851-5089536-17d1826c2f81457","identities":"eyIkaWRlbnRpdHlfbG9naW5faWQiOiI1MDExMzUwIiwiJGlkZW50aXR5X2Nvb2tpZV9pZCI6IjE3ZGYwMzZmZThlMTE4Yy0wYTNlNjI3Nzg5NzI0NS0zNjY1NzQwNy01MDg5NTM2LTE3ZGYwMzZmZThmMTg1ZCJ9","history_login_id":{"name":"$identity_login_id","value":"5011350"}}; Hm_lvt_156e88c022bf41570bf96e74d090ced7=1649857781; figui=zAz5CXlx3sNO11A5; deviceId=4f35c68559600ef62058a23c93e2a66c; passportUid=5011350; tblBackUrl=; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_log_id=ZFrVVBaUheTG857OFOs:75f702b9-b9d0-4da8-b3b3-a3b556b71fc9:bc72a050-42b0-478f-9293-32b78c86fcf7; ssoToken=d0d46f07cf8a7cd862f003a3abe33186; access-edu_online=b9c54d500ec056c68a0bd06cf9b04670; 99f53b614ce96c83_gr_session_id=16397032-377f-4c3e-b322-df22ea0973e0; 99f53b614ce96c83_gr_session_id_16397032-377f-4c3e-b322-df22ea0973e0=true; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_view_log_id=FfmM8LZfLoBqn8cnhPM; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_kuickDeal_pageIndex=1; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_kuickDeal_leaveTime=1656603789388; kkb_edu_session=eyJpdiI6IjI5RGtyRldJQU5ZTFZsM3NoUkdZTUE9PSIsInZhbHVlIjoiNzNvZzQ2SStLa3ZRd2JwV3RMUGp5Q2h1a3I0OUhOTGkzVnU4WU5sTFk1eUJsWnlyakRZcTVZQUkxXC83VmZkXC95IiwibWFjIjoiNmQ4ZGVmNDRkNjIwYjY0Y2FkYzM5YzNmNGVjZmEwMWZiYTY5NDk2M2U5MTkzNDg2NmQ0MGMyM2U2ZmUyNzFkZiJ9'
    }
  }

  const courseUrl = 'https://weblearn.kaikeba.com/student/courseinfo?course_id=214176&__timestamp=1656603904859'
  const chapterUrl = 'https://weblearn.kaikeba.com/student/chapterinfo?course_id=214176&chapter_id=213551&__timestamp=1656603905697'
  const mediaUrl = 'https://api-vod.baoshiyun.com/vod/v1/platform/media/detail'

  const accessToken = '55653771acdb493abe0fd129df325215'

  const { data: { data: courseInfo } } = await axios.get(courseUrl, config)
  const chapterList = courseInfo.chapter_list
  console.log(chapterList);


  let allText = ''
  console.log(chapterList.length);
  for (let i = 0; i < chapterList.length; i++) {

    const chapterName = `${i + 1}、${chapterList[i].chapter_name}`
    const chapterPath = `${basePath}/${chapterName}`
    console.log(await checkPath(chapterPath))
    const url = chapterUrl + chapterList[i].chapter_id
    const { data: { data: chapterInfo } } = await axios.get(url, config)
    // console.log(chapterInfo);

    const sectionList = chapterInfo.section_list
    for (let j = 0; j < sectionList.length; j++) {

      // console.log(sectionList[0].group_list[0].content_list[0].content.length);
      const groupInfo = sectionList[j].group_list[0]
      let name = groupInfo.group_name.replace(/\//g, '-')
      const groupName = `${j + 1}、${name}`
      const groupPath = `${chapterPath}/${groupName}`
      console.log(await checkPath(groupPath))

      const contentList = groupInfo.content_list
      const fileName = groupPath + '/' + name + '.txt'
      for (let k = 0; k < contentList.length; k++) {
        // if(k) break
        const { content: contents, content_type, content_title } = contentList[k]

        if (content_type === 3 || content_type === 7) {
          // fs.rmSync(fileName)
          let contentText = ''
          for (let l = 0; l < contents.length; l++) {
            const { callback_key: mediaId } = contents[l]
            const params = { mediaId, accessToken }
            const { data: { data: videoInfo } } = await axios.get(mediaUrl, { ...config, params })
            const { playURL } = videoInfo.mediaMetaInfo.videoGroup[0]
            console.log(playURL);
            contentText += `ffmpeg -i ${playURL} -c copy -bsf:a aac_adtstoasc ./${content_title}--${l < 9 ? 0 : ''}${l + 1}.mp4\n`
            allText += `ffmpeg -i ${playURL} -c copy -bsf:a aac_adtstoasc "${path.resolve(groupPath)}/${content_title}--${l < 9 ? 0 : ''}${l + 1}.mp4"\n`
          }
          contentText += '\n'
          allText += '\n'
          fs.writeFileSync(fileName, contentText, { flag: 'a+' })
        }

        if (content_type === 6) {
          for (let l = 0; l < contents.length; l++) {
            const { name, url } = contents[l]
            const file = groupPath + '/' + name
            const writer = fs.createWriteStream(file)
            const response = await axios({ url, responseType: 'stream' })
            response.data.pipe(writer)
          }
        }
      }
    }
  }
  fs.writeFileSync('./video/allText.txt', allText)
})()