import React from 'react'

type Opportunity = {
  id: number,
  title: string
}
const OpportunitiesList = ({opportunities, activeTab} : {opportunities: Opportunity[], activeTab: string}) => {
  return (
    <div style = {{paddingTop: "1rem"}}>OpportunitiesList</div>
  )
}

export default OpportunitiesList