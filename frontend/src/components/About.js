import React from 'react'
function About() {

  return (
    <>
    <div style={{cursor: "none"}} className='container d-flex flex-column align-items-center'>
      <h1 data-cursor-img="https://img.freepik.com/free-photo/cloud-blue-sky_1122-624.jpg" className='my-3'>This is Note<p style={{display: "inline-block", color: "skyblue"}}>Cloud</p> </h1>
      <h4>An online Note facility that enables you</h4>
      <h4>To write your Notes and read your Notes from anywhere.</h4>
      <em className='text-body-secondary'>Website Maintained By Mohd Najmuddin</em>
      <em className='text-body-tertiary'>mohdnajmuddin8542@gmail.com</em>
    </div>
    </>
  )
}

export default About
