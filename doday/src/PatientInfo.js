import React, { Component } from 'react'
import { getPatientConditions } from './Api'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import CircularProgress from '@material-ui/core/CircularProgress'

const TABLE_PROPS = {
    columns: [
        { Header: 'Condition', accessor: (c) => c.resource.code.text, id: 'condition' },
        { Header: 'Date Recorded', accessor: (c) => c.resource.dateRecorded, id: 'dateRecorded' },
        { Header: 'PubMed Link', accessor: (c) => <PubMedLink condition={c} />, id: 'pubMed'}
      ],
    defaultSorted: [
      {id: 'dateRecorded', desc: true}
    ],
    noDataText: 'No conditions found for patient.'
}

const PubMedLink = ({ condition }) => {
    const conditionName = condition.resource.code.text;
    const url = `https://www.ncbi.nlm.nih.gov/pubmed/?term=${encodeURIComponent(conditionName)}`;
    return (
      <a href={url} title={`Search "${conditionName}"`} target="_blank" rel="noopener noreferrer" >
        Search PubMed
      </a>
    );
}

class PatientInfo extends Component {
    constructor(props) {
        super(props);
        this.state= {
            conditions: null,
            conditionsLoading: true,
            error: false
        }
    }

    componentDidMount() {
        getPatientConditions(this.props.patientID)
            .then((response) => {
                this.setState({conditions: this.filterActiveConditions(response.data.entry), conditionsLoading: false, error: false})
            })
            .catch((error) => {
                this.setState({error: true})
            })
    }

    filterActiveConditions(allConditions) {
        return allConditions.filter((c) => c.resource.clinicalStatus === 'active')
    }

    render () {
        let error = this.state.error
        const { patientInfo } = this.props
        const { conditions, conditionsLoading } = this.state
        const entry = patientInfo.entry ? patientInfo.entry[0] : null
        if (!entry) {
            error = true
        }
        return (
        <>
            {!error &&
                <div style={{marginBottom: '10px'}}>
                    <div>Name: {patientInfo.entry[0].resource.name[0].text}</div>
                    <div>Gender: {patientInfo.entry[0].resource.gender}</div>
                    <div>Date of Birth: {patientInfo.entry[0].resource.birthDate}</div>
                </div>
            }
            {error &&
                <div>There was an error with your request. Please try again.</div>}
            {conditionsLoading && !error &&
                <>
                    <p>Looking for patient conditions...</p>
                    <CircularProgress />
                </>
            }
            {conditions && (
                <ReactTable data={conditions} {...TABLE_PROPS} />
            )}
        </>
        )
    }
}

export default PatientInfo
