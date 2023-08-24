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
      Authorization: 'Bearer pc:4e4094c555aa391e36f3a64d303650a9',
      cookie: 'gr_user_id=e3537e02-53f9-47c2-ab79-1d5e155c760f; kd_user_id=3fafee7b-7e18-4080-9cb1-6982ba8f3ed5; sensorsdata2015jssdkcross={"distinct_id":"5011350","first_id":"17d1826c2f710ff-095bdd71fd0cda8-1c306851-5089536-17d1826c2f81457","props":{"$latest_traffic_source_type":"","$latest_search_keyword":"","$latest_referrer":""},"$device_id":"17d1826c2f710ff-095bdd71fd0cda8-1c306851-5089536-17d1826c2f81457","identities":"eyIkaWRlbnRpdHlfbG9naW5faWQiOiI1MDExMzUwIiwiJGlkZW50aXR5X2Nvb2tpZV9pZCI6IjE3ZGYwMzZmZThlMTE4Yy0wYTNlNjI3Nzg5NzI0NS0zNjY1NzQwNy01MDg5NTM2LTE3ZGYwMzZmZThmMTg1ZCJ9","history_login_id":{"name":"$identity_login_id","value":"5011350"}}; Hm_lvt_156e88c022bf41570bf96e74d090ced7=1649857781; figui=zAz5CXlx3sNO11A5; deviceId=4f35c68559600ef62058a23c93e2a66c; passportUid=5011350; tblBackUrl=; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_log_id=ZFrVVBaUheTG857OFOs:75f702b9-b9d0-4da8-b3b3-a3b556b71fc9:bc72a050-42b0-478f-9293-32b78c86fcf7; Hm_lvt_9a1843872729d95c5d7acbea784c51b2=1656765385; Hm_lpvt_9a1843872729d95c5d7acbea784c51b2=1656765385; zg_did={"did": "181bee98b9dfc2-06fc5b99130688-1d525635-4da900-181bee98b9e10d5"}; current={"name":"","courseid":99}; user={"keep7day":true,"qq":"11111222","true_name":"","mobile":"15557156725","name":"","id":86493,"is_paid":1,"avatar":"http://kkbconsole2.kaikeba.com/statics/images/avatar_100_100.png","token":"0865a838e1fe44848a17298fbe98a2c2"}; zg_7c9bcf6917804ce5ad8448db3cbe3fb3={"sid": 1656765385.632,"updated": 1656765448.885,"info": 1656765385634,"cuid": ""}; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_view_log_id=wvQSWU1nhC0rmmYo4KN; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_kuickDeal_pageIndex=4; kd_5d6526d7-3c9f-460b-b6cf-ba75397ce1ac_kuickDeal_leaveTime=1659701960673; ssoToken=522717707decca276c837da64a370a59; access-edu_online=4e4094c555aa391e36f3a64d303650a9; 99f53b614ce96c83_gr_session_id=3226f0aa-c169-42af-94c7-33d28a605e63; 99f53b614ce96c83_gr_session_id_3226f0aa-c169-42af-94c7-33d28a605e63=true; kkb_edu_session=eyJpdiI6IitUUUhab041ZHBiUE1LaUx4VnVJQnc9PSIsInZhbHVlIjoiSm9mUEowWWYra1RzWkhwRVA2T0ZRV2xBalpjaG1CQ1J0dXg2eU9BVjdXMytSNDk1N3FyZm1ZQXJaSDA3RlNIaSIsIm1hYyI6IjE5OGY2NGQxMGYwMjQ5ZDVjNjE5ZmU4MDNhZmNiOTU4ODQ3ZGFjNDkzZjlmMWI1OTUxMWExOWFhNmQxYzA4NTQifQ=='
    }
  }

  const courseUrl = 'https://weblearn.kaikeba.com/student/courseinfo?course_id=245709&__timestamp=1661263603318'
  const chapterUrl = 'https://weblearn.kaikeba.com/student/chapterinfo?course_id=245709&chapter_id='
  const mediaUrl = 'https://api-vod.baoshiyun.com/vod/v1/platform/media/detail'

  const accessToken = '102bd8b30c014bdc8ef884cb348bace5'

  const { data: { data: courseInfo } } = await axios.get(courseUrl, config)
  const chapterList = courseInfo.chapter_list
  console.log(chapterList);


  let allText = ''
  console.log(chapterList.length);
  for (let i = 0; i < chapterList.length; i++) {
    // if (i > 1) return;
    const chapterName = `${i + 1}、${chapterList[i].chapter_name}`
    const chapterPath = `${basePath}/${chapterName}`
    console.log(await checkPath(chapterPath))
    const url = chapterUrl + chapterList[i].chapter_id
    const { data: { data: chapterInfo } } = await axios.get(url, config)
    // console.log(chapterInfo);

    const sectionList = chapterInfo.section_list
    for (let j = 0; j < sectionList.length; j++) {

      // console.log(sectionList[0].group_list[0].content_list[0].content.length);
      const groupInfo = sectionList[j]?.group_list[0] || {}
      let name = groupInfo?.group_name?.replace(/\//g, '-') || ''
      const groupName = `${j + 1}、${name}`
      console.log('----------', chapterPath, groupName);
      const groupPath = `${chapterPath}/${groupName}`
      console.log(await checkPath(groupPath))

      const contentList = groupInfo?.content_list || []
      const fileName = groupPath + '/' + name + '.txt'
      for (let k = 0; k < contentList.length; k++) {
        // if(k) break
        const { content: contents = [], content_type, content_title } = contentList[k]

        if (content_type === 3 || content_type === 7) {
          // fs.rmSync(fileName)
          let contentText = ''
          for (let l = 0; l < contents.length; l++) {
            const { callback_key: mediaId } = contents[l]
            const params = { mediaId, accessToken }
            const { data: { data: videoInfo } } = await axios.get(mediaUrl, { ...config, params })
            // console.log('--------', videoInfo, mediaUrl);
            const { playURL } = videoInfo.mediaMetaInfo.videoGroup[0]
            console.log(playURL);
            contentText += `ffmpeg -i ${playURL} -c copy -bsf:a aac_adtstoasc ./${content_title}--${l < 9 ? 0 : ''}${l + 1}.mp4\n`
            allText += `ffmpeg -i ${playURL} -c copy -bsf:a aac_adtstoasc "${path.resolve(groupPath)}/${content_title}--${l < 9 ? 0 : ''}${l + 1}.mp4"\n`
          }
          contentText += '\n'
          allText += '\n'
          fs.writeFileSync(fileName, contentText, { flag: 'a+' })
        }
        fs.writeFileSync('./video/allText.txt', allText)
        if (content_type === 6) {
          for (let l = 0; l < contents.length; l++) {
            const { name, url } = contents[l]
            const file = groupPath + '/' + name
            console.log('>>>>>>>>>', file)
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