import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import MainContainer from '../../components/layouts/MainContainer'
import { Col } from 'react-bootstrap';
import EbooksAPI from '../../api/EbooksAPI';
import { toast } from 'react-toastify';

export default function Dashboard() {

  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [loading, setLoading] = useState(false);
  const [ebooks, setEbooks] = useState([]);

  useEffect(() => {
    fetchEbooks()
  }, [])

  const fetchEbooks = async() => {
    setLoading(true);
    const response = await new EbooksAPI().studentEbooks(user?.userId);
    if(response.ok){
      setEbooks(response.data);
    }else{
      toast.error("Something went wrong while fetching ebooks links.")
    }
    setLoading(false)
  }

    return (
      <MainContainer loading={loading} title="" activeHeader={""}>
        <Col className='px-4' sm={12}>
        <h2 className="primary-color mt-5 mb-5">Ebook Links</h2>
        {ebooks?.map((e, key) => {
          return(
            <Col key={key}>
              <h4>{e.course?.courseName}</h4>
              <h5 className='m-3'>Link: <a target="_blank" className='class-links' href={e.ebook?.ebookLink}>{e.ebook?.ebookLink}</a></h5>
              <hr />
            </Col>
          )
        })}
        </Col>
      </MainContainer>
    )
}
