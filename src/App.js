import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Swal from 'sweetalert2';

import './App.css';
import Navbar from './components/Navbar';
import BG_IMAGE from './assets/cf_bg.jpg';
import Main from './components/Main';
import Loader from './global/Loader';
import CrowdFunding from './abis/Crowdfunding.json';
import { ethToWei } from './utils';

function App() {
    const [currentAccount, setCurrentAccount] = useState('');
    const [loading, setLoading] = useState('');
    const [projects, setProjects] = useState([]);
    const [cfContract, setCFContract] = useState({});

    const loadWeb3 = async () => {
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.enable();
                const { web3 } = window;
                const accounts = await web3.eth.getAccounts();
                setCurrentAccount(accounts[0]);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'User Rejected the Request!',
                });
            }
        }
        // Legacy dapp Browser...
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No browser wallet detected. You should consider trying MetaMask!',
            });
        }
    };

    const fetchProjectsList = async () => {
        if (window.web3) {
            const { web3 } = window;
            // Load Accounts
            const accounts = await web3.eth.getAccounts();
            // Set current Account to State
            setCurrentAccount(accounts[0]);
            // Get networkId
            const networkId = await web3.eth.net.getId();
            console.log({ networkId });
            const networkData = CrowdFunding.networks[networkId];
            // Get abi Data from ABI json file
            try {
                setLoading(true);
                const { abi } = CrowdFunding;
                const { address } = networkData;
                const contract = new web3.eth.Contract(abi, address);
                setCFContract({ ...contract });
                const projectCounter = await contract.methods.projectCount().call();
                const projectLists = [];
                for (let i = 1; i <= projectCounter; i++) {
                    const project = await contract.methods.projects(i).call();
                    projectLists.push(project);
                }
                setProjects(projectLists);
                setLoading(false);
            } catch (e) {
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Contract not deployed to detected Network!',
                });
            }
        }
    };

    const createProject = async (name, desc, target, closingDate) => {
        setLoading(true);
        try {
            cfContract.methods
                .createProject(name, desc, target, closingDate)
                .send({ from: currentAccount })
                .once('receipt', async (receipt) => {
                    await fetchProjectsList();
                    setLoading(false);
                })
                .catch((e) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: e.message,
                    });
                    setLoading(false);
                });
        } catch (e) {
            setLoading(false);
        }
    };

    const fundProject = async (id, amount) => {
        setLoading(true);
        try {
            const WeiAmt = ethToWei(amount);
            cfContract.methods
                .fundProject(id)
                .send({ from: currentAccount, value: WeiAmt })
                .once('receipt', async (receipt) => {
                    await fetchProjectsList();
                    setLoading(false);
                })
                .catch((e) => {
                    let err;
                    if (e.code === -32603)
                        err = "Owner can't fund the project created by themselves";
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err || e.message,
                    });
                    setLoading(false);
                });
        } catch (e) {
            setLoading(false);
        }
    };

    const closeProject = async (id) => {
        setLoading(true);
        try {
            cfContract.methods
                .closeProject(id)
                .send({ from: currentAccount })
                .once('receipt', async (receipt) => {
                    await fetchProjectsList();
                    setLoading(false);
                })
                .catch((e) => {
                    let err;
                    if (e.code === -32603) err = 'Only Project Owner can close this project.';
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err || e.message,
                    });
                    setLoading(false);
                });
        } catch (e) {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWeb3();
        fetchProjectsList();
    }, []);

    return (
        <div>
            <Navbar currentAccount={currentAccount} />
            <div className="container mt-5">
                <div className="row">
                    <main className="col-lg-12">
                        <div
                            className="p-md-5 mb-4 text-white rounded"
                            style={{
                                backgroundImage: `url(${BG_IMAGE})`,
                                height: '400px',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                            }}
                        />

                        {loading ? (
                            <Loader />
                        ) : (
                            <Main
                                projects={projects}
                                createProject={createProject}
                                fundProject={fundProject}
                                closeProject={closeProject}
                            />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default App;
