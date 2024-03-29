import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Modal, Nav } from "react-bootstrap";
import { BaseUrl } from '../api/index';
import {axiosInstanceWithoutToken} from '../api/axios';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import '../style/SignupLogin.css';

function SignupLogin() {
    const [show, setShow] = useState(false);
    const [modelTitle, setModelTitle] = useState("");
    const [param, setParam] = useState({});
    const [decodedToken, setDecodedToken] = useState();
    const navigate = useNavigate();

    const handleShow = () => setShow(true);

    function handleClose(loginOrSingup) {
        if (loginOrSingup === "login") {
            axiosInstanceWithoutToken.post(`${BaseUrl}/login`, param).then((res) => {
                if(res.status === 200){
                    const encodedToken = res.data.data.token;
                    sessionStorage.setItem('token', encodedToken);
                    const decoded = jwt_decode(res.data.data.token);
                    setDecodedToken(decoded);
                    // console.log(decoded.userDetails.userName);
                    window.alert(`Welcome ${decoded.userDetails.userName}`)
                }
            })
            setShow(false);
        } else if (loginOrSingup === "signup") {
            axiosInstanceWithoutToken.post(`${BaseUrl}/signup`, param).then((res) => {
                console.log(res.data);
            })
            setShow(false)
        } else {
            setShow(false);
        }
    }

    function handleModelTitle(parameter) {
        setModelTitle(parameter);
    }

    function createPayload(event) {
        setParam({ ...param, [event.target.name]: event.target.value });
        console.log(param);
    }

    function handleLogout() {
        if(window.confirm("Want to logout for sure!")){
            // sessionStorage.clear();
            sessionStorage.removeItem('token');
            setDecodedToken({})
            setParam({});
            navigate("/");
        }        
    }

    async function loginwithGoogle() {
        const res = await axios.get('http://localhost:8080/user/authorization/url', {params: {}});
        console.log(res.data)
        window.open(res.data.url, '_self')
    }

    return (
        <>
            {!sessionStorage.getItem('token') ? 
                <Nav.Link className="text loginBtn" 
                        onClick={() => 
                            {
                                handleShow();
                                handleModelTitle("login");
                            }
                        }> Login 
                </Nav.Link> : 
                <Nav.Link className="text loginBtn" 
                        onClick={() => 
                            {
                                handleLogout();
                            }
                        }> Logout 
                </Nav.Link>
            }
            {!sessionStorage.getItem('token') && 
                <Button variant="outline-light" 
                        onClick={() => 
                            {
                                handleShow();
                                handleModelTitle("signup");
                            }
                        }> Create an account 
                </Button>
            }

            <Modal className="modalBox" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    {modelTitle === "login" && <Modal.Title>Login</Modal.Title>}
                    {modelTitle === "signup" && <Modal.Title>Sign Up</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3 emailContainer" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                required
                                name="username"
                                type="email"
                                placeholder="name@example.com"
                                onChange={createPayload}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 passContainer" controlId="exampleForm.ControlInput1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                required
                                name="password"
                                type="password"
                                placeholder="abc12XH55%00"
                                onChange={createPayload}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='modalFooter'>
                    {
                        (!sessionStorage.getItem('token') && modelTitle === "login")
                        && <Button variant="primary" onClick={() => handleClose("login")}> Login </Button>
                    }
                    {
                        modelTitle === "signup"
                        && <Button variant="primary" onClick={() => handleClose("signup")}> Sign Up </Button>
                    }
                    <Button variant="success" onClick={loginwithGoogle}>Login With Google</Button>
                    <Button variant="danger" onClick={handleClose}> Cancle </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SignupLogin;