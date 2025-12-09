import React from 'react'

type Opportunity = {
  id: number,
  title: string
}
const OpportunitiesList = ({opportunities, activeTab} : {opportunities: Opportunity[], activeTab: string}) => {
  return (
    <div style = {{paddingTop: "1rem"}}>{ opportunities.map(opportunity => <div key = {opportunity.id}>{opportunity.title}, {activeTab}</div>)}</div> //TODO: change later in issue-#146
  )
}

export default OpportunitiesList