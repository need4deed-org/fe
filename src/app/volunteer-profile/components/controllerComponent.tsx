import React from 'react'
import PresentationalComponent from './presentationalComponent'
import { useVolunteerMock } from './useVolunteer.mock'

const ControllerComponent = () => {

  const volunteer = useVolunteerMock(1)

  return (
    <PresentationalComponent volunteer={volunteer}/>
  )
}

export default ControllerComponent