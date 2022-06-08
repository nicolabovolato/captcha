import { useEffect, useMemo, useState } from 'react'
import { Button, FormControl, InputGroup, Spinner, Stack, Image, Alert, Container, Form, Row, Col, FormGroup } from 'react-bootstrap'
import { generateCaptcha, solveCaptcha } from './api'

function App() {

    const [loading, setLoading] = useState(true)
    const [sendingSolution, setSendingSolution] = useState(false)

    const [captchaSolution, setCaptchaSolution] = useState('')
    const [captchaImage, setCaptchaImage] = useState('')
    const [captchaId, setCaptchaId] = useState('')

    const [error, setError] = useState('')
    const [solved, setSolved] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if(loading) {
            setError('')
            setSolved(false)
        }
    }, [loading])

    useEffect(() => {
        if(sendingSolution) {
            setError('')
            setSolved(false)
        }
    }, [sendingSolution])

    const disableControls = useMemo(() => loading || sendingSolution, [loading, sendingSolution])

    const fetchData = async () => {
        setLoading(true)

        try {
            const { id, jpegBase64 } = await generateCaptcha()
            setCaptchaId(id)
            setCaptchaImage(jpegBase64)
        }
        catch (err) {
            setError('Something went wrong generating the captcha.')
            setCaptchaId('')
            setCaptchaImage('')
        }

        setLoading(false)
    }

    const solveClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setSendingSolution(true)

        try {
            const solved = await solveCaptcha(captchaId, { answer: captchaSolution })

            if (!solved) setError('Incorrect answer')
            else setSolved(true)
        }
        catch (err) {
            setError('Something went wrong solving the captcha.')
            setSolved(false)
        }

        setSendingSolution(false)
    }

    const changeCaptchaClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setCaptchaSolution('')
        await fetchData()
    }

    return <Container className="vh-100">
        <Stack gap={3} className="h-100">
            <h1 className="text-center">Captcha</h1>
            <p className="text-center">By <a href="https://github.com/nicola-bovolato/captcha-validation" target="_blank">Nicola Bovolato</a></p>

            <div className="h-25 d-flex justify-content-center align-items-center">
                {loading ? <Spinner animation="border" variant="primary" /> : <img className="mw-100 mh-100" src={captchaImage} alt="captcha" />}
            </div>

            <Form>
                <Row>
                    <Col sm className='mb-sm-0 mb-2'>
                        <FormControl type="text" placeholder="Solution" onChange={e => setCaptchaSolution(e.target.value)} disabled={disableControls} />
                    </Col>
                    <Col sm="auto">
                        <InputGroup className="justify-content-center">
                            <Button variant="primary" type="submit" onClick={solveClicked} disabled={disableControls}>

                                <span>
                                {sendingSolution ? <Spinner animation="border" size="sm" /> : <i className="bi bi-check-circle"/>} Solve
                                </span>
                            </Button>
                            <Button variant="outline-primary" type="reset" onClick={changeCaptchaClicked} disabled={disableControls}>
                                <span>
                                {loading ? <Spinner animation="border" size="sm" /> : <i className="bi bi-arrow-clockwise"/> } Change Captcha
                                </span>
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
            </Form>

            {error && <Alert variant="danger"><i className="bi bi-exclamation-triangle"/> {error}</Alert>}
            {solved && <Alert variant="primary"><i className="bi bi-check-circle"/> Solved!</Alert>}
        </Stack>
    </Container>
}

export default App
