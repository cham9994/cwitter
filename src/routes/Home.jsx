import React, { useEffect } from 'react'
import { useState } from 'react'
import { collection, addDoc, onSnapshot } from 'firebase/firestore'
import { dbService } from 'fBase'
import Cweet from 'components/Cweet'

const Home = ({ userObj }) => {
  const [cweet, setCweet] = useState('')
  const [cweets, setCweets] = useState([])
  const [attachment, setAttachment] = useState('')

  // outdated 방식
  // const getCweets = async () => {
  //   const dbCweets = await getDocs(collection(dbService, 'cweet'))
  //   dbCweets.forEach((document) => {
  //     // cweet 데이터 하나 하나에 id 속성을 추가
  //     const cweetObject = {
  //       ...document.data(),
  //       id: document.id
  //     }
  //     setCweets((prev) => [cweetObject, ...prev])
  //   })
  // }

  useEffect(() => {
    onSnapshot(collection(dbService, 'cweet'), (snapshot) => {
      const cweetArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setCweets(cweetArray)
    })
  }, [])

  const onChange = (event) => {
    const {
      target: { value }
    } = event
    setCweet(value)
  }

  const onSubmit = async (event) => {
    // event.preventDefault()
    // await addDoc(collection(dbService, 'cweet'), {
    //   text: cweet,
    //   createdAt: Date.now(),
    //   creatorId: userObj.uid
    // })
    // setCweet('')
  }

  const onFileChange = (event) => {
    const {
      target: { files }
    } = event
    const theFile = files[0]
    const reader = new FileReader()
    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent)
      const {
        currentTarget: { result }
      } = finishedEvent
      setAttachment(result)
    }
    reader.readAsDataURL(theFile)
  }

  const onClearAttachment = () => {
    setAttachment(null)
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          value={cweet}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Cweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" alt="" />
            <button onClick={onClearAttachment}>clear</button>
          </div>
        )}
      </form>
      <div>
        {cweets.map((cweet) => (
          <Cweet key={cweet.id} cweetObj={cweet} isOwner={cweet.creatorId === userObj.uid} />
        ))}
      </div>
    </div>
  )
}

export default Home
