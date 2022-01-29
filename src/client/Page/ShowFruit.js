import * as React from 'react';
import Axios from 'axios';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import './ShowFruit.css'

const ShowFruit = () => {
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [fruitList, setFruitList] = useState([]);
    const [fruitListCategoryName, setfruitListCategoryName] = useState([]);
    const [newfruitList, setNewfruitList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [newName, setNewName] = useState('');
    const [newCategoryId, setNewCategoryId] = useState(0);
    const [isUpdate, setIsUpdate] = useState(false);
    const [fruit, setFruit] = useState({}); // current work with
    // image 24/01/2022
    const [allImages, setAllImages] = useState([]);
    const [image, setImage] = useState([]);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    useEffect(() => {
        // 1 fetch all Fruit 
        Axios.get('http://localhost:3000/fruits').then((response) => {
            setFruitList(response.data);
            // console.log('response', response)
        });
        // 5 fetch all Catagory
        Axios.get('http://localhost:3000/fruitsCategory').then((response) => {
            // console.log('response', response)
            setfruitListCategoryName(response.data);
        });
        // image 24/01/2022
        Axios.get('http://localhost:3000/selectAllImages').then((response) => {
            // console.log('1 response of selectAllImages >> ', response)
            setAllImages(response.data);
        });
    }, []);

    const addFruit = (event) => {
        // event.preventDefault();
        const formdata = new FormData();
        // formdata.append('id', id);
        formdata.append('name', name);
        formdata.append('category_id', newfruitList);
        // formdata.append('fruit_id', name);
        // formdata.append('avatar', userInfo.file);
        for (let i = 0; i < userInfo.file.length; i++) {
            formdata.append('avatar', userInfo.file[i]);
            console.log('pp', userInfo.file.length);
        }
        Axios.post('http://localhost:3000/fruits', formdata)
            .then((res) => {
                setFruitList([
                    ...fruitList,
                    {
                        // id: id,
                        name: name,
                        category_id: newfruitList,
                    },
                ]);
                // console.log('Axios');
                // console.log(res);
                console.log(res.data);
            })
            .catch((err) => {
                console.log('err client', err);
            });
    };

    // 25/01/2022 update fruit
    const updateFruit = (id, nameU, CategoryU) => {
        // setNewName(fruit.name);
        // setNewCategoryId(fruit.category_id);
        console.log('1 updateFruit id >> ', id)
        console.log('2 updateFruit newName >> ', newName)
        console.log('3 updateFruit newCategory >> ', newCategoryId)
        console.log('4 updateFruit updName >> ', nameU)
        console.log('5 updateFruit updCategory >> ', CategoryU)
        const formdata = new FormData();
        formdata.append('id', id);
        formdata.append('name', newName || nameU);
        formdata.append('category_id', newCategoryId || CategoryU);
        console.log('7', userInfo.file.length)
        console.log('7', userInfo.file)
        for (let i = 0; i < userInfo.file.length; i++) {
            formdata.append('avatar', userInfo.file[i]);
            console.log('8', userInfo.file.length)
            console.log('7', userInfo.file)
        }
        setNewName('')
        Axios.put('http://localhost:3000/fruits', formdata, {
            id: id,
            name: newName || nameU,
            category_id: newCategoryId || CategoryU
        }).then((res) => {
            setFruitList(
                fruitList.map((val) => {
                    return val.id === id
                        ? {
                            id: val.id,
                            name: newName,
                            category_id: newCategoryId,
                        }
                        : val;
                })
            );
            console.log(res.data);
        });
    };

    // 25/01/2022 update fruit
    const updateClick = (id, newName, newCategoryId, conFirm2) => {
        console.log('id', id)
        console.log('newName', newName)
        console.log('newCategoryId', newCategoryId)
        if (newName.length > 0 || newCategoryId > 0) {
            console.log('newName.length2', newName.length)
            console.log('newCategoryId.length2', newCategoryId.length)
            const nameU = newName
            const CategoryU = newCategoryId
            conFirmDelete(conFirm2)
            updateFruit(fruit.id, nameU, CategoryU);
        }
    };

    const deleteFruit = (id) => {
        // 4 delete
        Axios.delete(`http://localhost:3000/fruits/${id}`).then((response) => {
            setFruitList(
                fruitList.filter((val) => {
                    return val.id !== id;
                })
            );
        });
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const [userInfo, setuserInfo] = useState({
        file: [],
        filepreview: null
    });

    const handleInputChange = (event) => {
        console.log('2', event.target.files);
        console.log('2', userInfo);
        setuserInfo({
            ...userInfo,
            file: event.target.files,
            ff: Array.from(event.target.files).map((file) =>
                URL.createObjectURL(file)
            ),
            // filepreview: URL.createObjectURL(event.target.files[0]),
            filepreview: Array.from(event.target.files).map((file) =>
                URL.createObjectURL(file)
            ),
        });
    };

    const handleChange = (e) => {
        let value = e.target.value;
        // console.log(value)
        setNewfruitList(value);
    };

    const handleUpdate = (id) => {
        const fruit = fruitList.find((fruit) => fruit.id === id)
        const currCategory = fruit.category_id
        const image = allImages.filter((image) => image.fruit_id === id)
        setFruit(fruit)
        setNewCategoryId(currCategory)
        setImage(image)
        // console.log('179', fruit)
        // console.log('210 >> ', curCategory)
        // console.log('180 image is  >> ', image)
        // console.log('215 fruit >> ', fruit)
        // console.log(fruit.categoryname)
    }

    // image 24/01/2022
    const deleteImage = (id) => {
        Axios.delete(`http://localhost:3000/deleteImage/${id}`).then((response) => {
            setImage(
                image.filter((val) => {
                    return val.id !== id;
                })
            );
        });
    };

    //alert
    const [openConfirm, setOpenConfirm] = useState(false);
    const [conFirm, setConFirm] = useState('');
    const [yesConFirm, setYesConFirm] = useState('');
    const [upDateConFirm, setUpDateConFirm] = useState('');

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };
    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 2,
        p: 4,
    };

    const conFirmDelete = (conFirm2) => {
        // console.log('id2', id);
        // console.log('conFirm', conFirm);
        // console.log('conFirm1', yesConFirm);
        // console.log('conFirm5', conFirm2);

        if (conFirm && yesConFirm === 1 && conFirm2 === 2) {
            let p1 = yesConFirm === 1
            let p2 = conFirm2 === 2
            console.log('ยืนยันการลบรูปที่data');
            deleteImage(conFirm);
        } else if (conFirm && yesConFirm !== 1 && conFirm2 !== 2) {
            console.log('ยืนยันการลบรูป');
        } else {
            console.log('ลบรูปภาพไม่สำเร็จ');
        }
    };

    // console.log('fruitListCategoryName1',fruitListCategoryName)
    // console.log('userInfo.file', userInfo.file);
    // console.log('userInfo.file.length', userInfo.file.length);
    // console.log('typeof userInfo.file', typeof userInfo.file);

    return (
        <React.Fragment>
            <div className='ShowFruit'>
                <div class='container my-100'>
                    <br/>
                    <h1 class='font headsize'>Fruit Data</h1>
                    <Button
                        style={{
                            color: 'white',
                            backgroundColor: '#3d405b',
                            align: 'right',
                            float: 'right',
                            marginRight: '0px',
                        }}
                        variant='contained'
                        onClick={(e) => {
                            setIsUpdate(false);
                            handleClick(e);
                        }}
                    >
                        Add fruit
                    </Button><br/><br/>
                    <Popover
                        textAlign='center'
                        open={open}
                        onClose={handleClose}
                        data-toggle='popover'
                        data-placement='top'
                        data-content='Content'
                        anchorOrigin={{
                            vertical: 'center',
                            horizontal: 'center',
                        }}
                    >
                        {isUpdate ?
                            <div>
                                <div className='student card'>
                                    <div className='card-body text-left'>
                                        {/* <p className='card-text'>Id : {fruit.id}</p> */}
                                        <p className='card-text'>Name : {fruit.name}</p>
                                        <div className='d-flex'>
                                            <input
                                                className='form-control'
                                                style={{ width: '300px' }}
                                                type='text'
                                                onChange={(event) => {
                                                    setNewName(event.target.value);
                                                }}
                                                defaultValue={fruit.name}   // show old value in input
                                            />
                                        </div><br />
                                        <p className='card-text' > Category name: {fruit.categoryname}  </p>
                                        <div className='d-flex'>
                                            <TextField
                                                select
                                                label={fruit.categoryname}
                                                variant='outlined'
                                                size='small'
                                                fullWidth
                                                onChange={(event) => {
                                                    console.log('312 newCategoryId >> ', newCategoryId)
                                                    setNewCategoryId(event.target.value);
                                                }}
                                            >
                                                {fruitListCategoryName.map((val, key) => {
                                                    return (
                                                        <MenuItem key={key} value={val.id}>
                                                            {val.type}
                                                        </MenuItem>
                                                    );
                                                })}
                                            </TextField>
                                            &nbsp;&nbsp;&nbsp;
                                        </div><br />
                                        <div className='form-mb-3 '>
                                            {/* <p className='card-text'>Select Image : </p> */}
                                            <label className='card-text'>Select Image :</label>
                                            <input
                                                type='file'
                                                multiple
                                                className='form-control'
                                                name='upload_file'
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <br />

                                        {/* show name of old image */}
                                        <ol class='list-group list-group-numbered'>
                                            {image.map((image, i) => {
                                                // console.log('320 image >> ', image)
                                                return (
                                                    <li class='list-group-item'>image {i + 1} : <img src={`/${image.name}`} width='55' height='40' /> {image.name}
                                                        <div style={{ 'textAlign': 'right' }}><button style={{ 'backgroundColor': '#e07a5f' }}
                                                            onClick={(e) => {
                                                                setConFirm(image.id)
                                                                handleOpenConfirm(e)
                                                                // id of image want to delete
                                                                // console.log('326 image id >> ', image.id)
                                                                // deleteImage(image.id);
                                                            }}>Delete</button></div>
                                                    </li>
                                                );
                                            })}
                                        </ol><br />

                                        <Modal
                                            open={openConfirm}
                                            onClose={handleCloseConfirm}
                                            aria-labelledby='modal-modal-title'
                                            aria-describedby='modal-modal-description'
                                        >
                                            <Box sx={style}>
                                                <Typography
                                                    id='modal-modal-title'
                                                    variant='h6'
                                                    component='h2'
                                                >
                                                    ยืนยันที่จะทำการลบหรือไม่
                                                </Typography>
                                                <Typography
                                                    id='modal-modal-description'
                                                    sx={{ mt: 2 }}
                                                >
                                                    <Button
                                                        variant='contained'
                                                        style={{
                                                            background: '#e07a5f',
                                                            color: 'black',
                                                            margin: '10px',
                                                            left: '60%',
                                                        }}
                                                        onClick={(e) => {
                                                            setYesConFirm(1);
                                                            conFirmDelete();
                                                        }}
                                                    >
                                                        Yes
                                                    </Button>
                                                    <Button
                                                        variant='contained'
                                                        style={{
                                                            background: '#d6ccc2',
                                                            color: 'black',
                                                            margin: '0.5px',
                                                            left: '60%',
                                                        }}
                                                        onClick={(e) => {
                                                            handleCloseConfirm(e);
                                                            console.log('ยกเลิกการลบรูป');
                                                        }}
                                                    >
                                                        No
                                                    </Button>
                                                </Typography>
                                            </Box>
                                        </Modal>

                                        {/* preview image */}
                                        {userInfo.filepreview !== null ? (
                                            <div className='row text-center'>
                                                {userInfo.filepreview.map((url) => {
                                                    return (
                                                        <img
                                                            className='preview'
                                                            src={url}
                                                            alt='UploadImage'
                                                            style={{ 'height': '70px', 'width': '130px', 'textAlign': 'right' }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        ) : null}

                                        <div className='card-body text-center'>
                                            <button
                                                className='btn btn-warning'
                                                onClick={(e) => {
                                                    console.log('userInfo.file.length', userInfo.file.length);
                                                    if (newName.length === 0 || newCategoryId.length === 0) {
                                                        console.log('newNameee.length1', newName.length)
                                                        console.log('newCategoryId.length1', newCategoryId.length)
                                                        console.log('test1')
                                                        setNewName(fruit.name)
                                                        setNewCategoryId(fruit.category_id)
                                                        let conFirm = 2
                                                        console.log('382 newCategoryId >> ', newCategoryId)
                                                        updateClick(fruit.id, fruit.name, fruit.category_id, conFirm)
                                                    } else if (newName.length === 0 || newCategoryId.length === 0 && userInfo.file.length > 0) {
                                                        console.log('test2')
                                                        setNewName(fruit.name)
                                                        setNewCategoryId(fruit.category_id)
                                                        console.log('388 newCategoryId >> ', newCategoryId)
                                                        updateClick(fruit.id, fruit.name, fruit.category_id)
                                                    } else {
                                                        console.log('test3')
                                                        console.log('updateCategory')
                                                        updateFruit(fruit.id);
                                                    }
                                                    // updateFruit(fruit.id);
                                                    handleClose(e);
                                                }}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            :
                            <Typography sx={{ p: 25 }} textAlign='center'>
                                <form action=''>
                                    <div className='mb-3 text-left'>
                                        <label className='form-label' htmlFor='name'>
                                            Name:
                                        </label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            placeholder='Enter name'
                                            onChange={(event) => {
                                                console.log(event.target.value)
                                                setName(event.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className='mb-3 text-left'>
                                        <label className='form-label' htmlFor='provincename'>
                                            Category name:
                                        </label>
                                        <TextField
                                            select
                                            label='category_name'
                                            variant='outlined'
                                            size='small'
                                            fullWidth
                                            onChange={handleChange}
                                        >
                                            {fruitListCategoryName.map((val, key) => {
                                                return (
                                                    <MenuItem key={key} value={val.id}>
                                                        {val.type}
                                                    </MenuItem>
                                                );
                                            })}
                                        </TextField>

                                        <div className='form-mb-3 text-center'>
                                            <label className='text-white'>Select Image :</label>
                                            <input
                                                className='form-control form-control-lg mb-3'
                                                type='file'
                                                multiple
                                                name='avatar'
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <br />
                                        {userInfo.filepreview !== null ? (
                                            <div className='row'>
                                                {userInfo.filepreview.map((url) => {
                                                    return (
                                                        <img
                                                            className='preview'
                                                            src={url}
                                                            alt='UploadImage'
                                                            style={{ 'height': '70px', 'width': '130px', 'textAlign': 'right' }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        ) : null}
                                    </div>
                                    <button className='btn btn-success' onClick={addFruit}>
                                        Save
                                    </button>
                                </form>
                            </Typography>
                        }
                    </Popover>
                    <TableContainer component={Paper} style={{ padding: '0px', backgroundColor: '#f8edeb' }}>
                        <Table sx={{ minWidth: 500 }} aria-label='customized table'>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align='center' fontSize='large' style={{ padding: '20px', backgroundColor: '#81b29a', color: 'black' }}>
                                        ID
                                    </StyledTableCell>
                                    <StyledTableCell align='center' style={{ padding: '20px', backgroundColor: '#81b29a', color: 'black' }}>NAME</StyledTableCell>
                                    <StyledTableCell align='center' style={{ padding: '20px', backgroundColor: '#81b29a', color: 'black' }}>CATEGORY ID</StyledTableCell>
                                    <StyledTableCell align='center' style={{ padding: '20px', backgroundColor: '#81b29a', color: 'black' }}>STATUS</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fruitList.map((row) => (
                                    <StyledTableRow key={row.id}>
                                        <StyledTableCell component='th' scope='row' align='center'>
                                            {row.id}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>{row.name}</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            {row.categoryname}
                                        </StyledTableCell>
                                        <br />
                                        <button
                                            className='btn btn-danger'
                                            align='center'
                                            onClick={() => {
                                                deleteFruit(row.id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                        &nbsp;&nbsp;&nbsp;
                                        <button
                                            className='btn btn-warning'
                                            // onClick={handleClickk}
                                            onClick={(e) => {
                                                setIsUpdate(true);
                                                handleUpdate(row.id);
                                                //  handleUpdatee(row.id);
                                                handleClick(e);
                                            }}
                                        >
                                            Update
                                        </button>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </React.Fragment >
    );
};

export default ShowFruit;