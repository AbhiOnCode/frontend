import { get as ENV } from 'react-global-configuration'
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Helmet } from 'react-helmet'
import { Container, Grid } from 'semantic-ui-react'
import { Header, Label, Divider, Image, Message, Button, Segment, Icon, Select, Checkbox } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'

import FileDropWithPreview from '../components/FileDropWithPreview';

import Editor from '../components/MarkdownEditor'
import LogoButton from '../components/LogoButton'
const errorLabel = <Label color="red" pointing/>

@inject('JobStore')
@observer
class _Input extends React.Component {
  render () {
    const { name, JobStore: {job, handleChange}, ...rest} = this.props
    return (
      <Form.Input name={name} value={job[name]} onChange={handleChange} {...rest} />
    )
  }
}

@inject('routingStore')
@inject('JobStore')
@observer
class JobEdit extends React.Component {
  componentWillMount () {
    const { slug, securitySuffix } = this.props.match.params
    this.props.JobStore.fetchForEditing({ slug, securitySuffix })
  }

  render() {
    const { loading, loadingImage, error, loadingImageName } = this.props.JobStore
    const formState = { error, loading }

    const { job, _changes, handleChange, save, reset, imageUpload } = this.props.JobStore
    const onChange = {onChange: handleChange}
    let [errorHeader, errorContent] = ['Something went wrong', `Please check all fields and ensure they are filled! ${error}`]

    if (error && error.response) {
      const {status, statusText, data} = error.response
      errorHeader = status + ' ' + statusText
      errorContent = data
    }

    return (
      <Container className="PostAJob" text>
        <Helmet>
          <title>Edit a job | Crypto Jobs List</title>
        </Helmet>
        <Form size='large' widths='equal' {...formState}>
          <Header as='h1'>Edit a Job</Header>
          <Divider horizontal />
          <Message error header={errorHeader} content={errorContent} />
          <_Input name='jobTitle' label='Title' placeholder='e.g. Blockchain Engineer' validations="minLength:3" required />
          <Form.Group>
            <div className='field'>
              <_Input name='jobLocation' label='Location' placeholder='e.g. New York, Remote, Singapore…' validations="minLength:3" required />
              <Checkbox name='remote'  label='🌍 Remote OK' {...onChange} checked={job.remote} />
              <Checkbox name='paidRelocation'  label='✈️ Paid Relocation' {...onChange} checked={job.paidRelocation} />
              <Checkbox name='visaSponsor'  label='🛂 Visa Sponsor' {...onChange} checked={job.visaSponsor} />
            </div>
          </Form.Group>
          <div className='field'>
            <label>About your company</label>
            <Editor name='companyAbout' value={job.companyAbout} handleChange={handleChange} />
          </div>
          {/*<Form.TextArea
            name='companyAbout' label='About your company'
            placeholder="What's special about your company? What hard problems are you solving? What's great about your culture? 200 words minimum, please…"
            rows='7'
            validations="minLength:200"
            validationErrors={{ minLength: '200 words, please…' }}
            required
            errorLabel={errorLabel}
            value={job.companyAbout}
            {...onChange} />*/}
          <div className='field'>
            <label>Job description</label>
            <Editor name='jobDescription' value={job.jobDescription} handleChange={handleChange} />
          </div>
          {/*<Form.TextArea
            name='jobDescription' label='Job description' placeholder="Responsibilities? Requirements? What's exciting about this role? 300 words minimum, please… (Markdown supported)" rows='10'
            validations="minLength:300"
            validationErrors={{ minLength: '300 words, please…' }}
            required
            errorLabel={errorLabel}
            value={job.jobDescription}
            {...onChange} />*/}
          <Form.Group>
            <_Input name='skills' label='Skills' placeholder='solidity, javascript, C++, python, marketing…' />
            <div className='field'>
              <label>Category</label>
              <Select name='category' label='Type of Position' options={this.props.JobStore.jobCategories} defaultValue='Engineering' {...onChange} value={job.category}/>
            </div>
          </Form.Group>
          <Form.Group>
            <div className='field'>
              <_Input name='salaryRange' label='Salary range' placeholder='USD 90-120k, 2% Equity …' validations="minLength:3" />
              <Checkbox name='paysInCrypto' label={<label><Icon name='btc' color='orange' />Pay in cryptocurrency: BTC/ETH/LTC/XMR…</label>} {...onChange} checked={job.paysInCrypto} />
            </div>
            <div className='field'>
              <label>Engagement type</label>
              <Select name='employmentType' label='Type of Position' options={this.props.JobStore.employmentTypeOptions} defaultValue='FULL_TIME' {...onChange} value={job.employmentType}/>
            </div>
          </Form.Group>
          {/*<p>↑ <b>Don't</b> put things like <i>"Negotiable"</i> or <i>"Competitive"</i> — candidates ignore such jobs posts like spam…</p>*/}
          <Divider horizontal />

          <Header as='h3' content=' 🏢 Your Company Details' />
          <Grid columns={2}>
            <Grid.Column>
              <_Input name='companyUrl' label='Web Site' placeholder='https://yoursite.com' validations="isUrl" required />
              <_Input name='companyName' label='Company Name' placeholder='Keep it short: e.g. CryptoCoin' validations="minLength:2" required/>
              <_Input name='companyTwitter' label='Twitter' placeholder='@twitterHandle' validations="minLength:3" />
            </Grid.Column>
            <Grid.Column>
              <div className='field'>
                <label>Your 🎨 Company Logo</label>
              </div>
              <_Input name='companyLogo' size='mini' placeholder='https://<image>.png or Drop your Image below 👇' validations="isUrl" />
              <FileDropWithPreview
                image={{
                  title: 'Company Logo',
                  src: job.companyLogo || ENV('imgPlaceholder'),
                  size: 'medium',
                  rounded: true,
                  bordered: true,
                }}
                input={{
                  name: 'companyLogo',
                  label: 'Logo',
                  onChange: imageUpload,
                }}
                loading={loadingImage && loadingImageName === 'companyLogo'}
                error={error}
              />
            </Grid.Column>
          </Grid>


          <Divider horizontal />
          <Header as='h3' content=" 💁 Let's get personal!" />
          <_Input name='bossName' label="Your or your boss' name" placeholder='e.g. Vitalik Buterin' validations="minLength:3" required />

          <div className='field'>
            <label>Your Lovely 🤓 Photo:</label>
          </div>
          <Grid columns={2}>
            <Grid.Column>
              <_Input name='bossPicture' size='mini' placeholder='https://<image>.png or Drop your Image below 👇' validations="isUrl" />
              <FileDropWithPreview
                image={{
                  title: "Boss' Picture",
                  src: job.bossPicture || ENV('imgPlaceholder'),
                  size: 'small',
                  circular: true,
                  bordered: true,
                }}
                input={{
                  name: 'bossPicture',
                  label: 'Profile Picture',
                  onChange: imageUpload,
                }}
                loading={loadingImage && loadingImageName === 'bossPicture'}
                error={error}
              />
            </Grid.Column>
            <Grid.Column>
            </Grid.Column>
          </Grid>
          <Divider horizontal />

          <_Input name='companyEmail' label='Send applicants to:' placeholder='your@email.com' type='email'
            validations='minLength:5'
            validationErrors={{ isEmail: 'Email is not valid' }}
            required errorLabel={errorLabel} />
          <Divider horizontal />

          <Message error header={errorHeader} content={errorContent} />
          <Button content='Save' loading={loading} color='green' onClick={save} />
          { !!_changes.length && <Button content='Reset changes' onClick={reset} /> }
          { job.canonicalURL &&
            <Button as="a" href={job.canonicalURL} target='_blank'  content='View' icon='external' labelPosition='right' /> }
          { !!_changes.length && <p>You've made {_changes.length} changes to your listing</p>}
        </Form>
      </Container>
    )
  }
}

export default JobEdit;
