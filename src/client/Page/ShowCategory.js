import * as React from "react";
import Axios from "axios";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import './ShowCategory.css'

const ShowCategory = () => {
  const [id, setId] = useState(0);
  const [type, setTypeName] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [category, setCategory] = useState({}); // store Object
  const [newName, setNewName] = useState("");

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
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  useEffect(() => {
    Axios.get("http://localhost:3000/categorys").then((response) => {
      setCategoryList(response.data);
    });
  }, []);

  const addCategory = () => {
    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('type', type);
    formdata.append('avatar', userInfo.file);
    Axios.post("http://localhost:3000/categorys", formdata, {
    }).then(() => {
      setCategoryList([
        ...categoryList,
        {
          id: id,
          type: type,
        },
      ]);
    });
  };

  const deleteCategory = (id) => {
    Axios.delete(`http://localhost:3000/categorys/${id}`).then((response) => {
      setCategoryList(
        categoryList.filter((val) => {
          return val.id !== id;
        })
      );
    });
  };

  // 25/01/2022
  const updateCategory = (id, nameU) => {
    console.log("1 id >> ", id);
    console.log("2 currName >> ", newName); // error
    console.log("2 updName >> ", nameU);
    console.log("3 file >> ", userInfo.file);
    console.log("3 file.length >> ", userInfo.file.length);
    const formdata = new FormData();
    formdata.append("id", id);
    formdata.append("type", newName || nameU);
    formdata.append("avatar", userInfo.file);
    setNewName("")
    Axios.put("http://localhost:3000/categoryss", formdata, {
      id: id,
      type: newName || nameU,
    }).then((res) => {
      setCategoryList(
        categoryList.map((val) => {
          return val.id === id
            ? {
              id: val.id,
              type: newName,
            }
            : val;
        })
      );
      console.log(res.data);
    });
  };

  // 25/01/2022
  const updateClick = (id, newName) => {
    console.log("id", id)
    console.log("newName", newName)
    if (newName.length > 0) {
      console.log("newNameee", newName)
      console.log("newNameee", newName.length)
      const nameU = newName
      updateCategory(category.id, nameU);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = (id) => {
    const category = categoryList.find((category) => category.id === id);
    setCategory(category);
  };

  const open = Boolean(anchorEl);

  const [userInfo, setuserInfo] = useState({
    file: [],
    filepreview: null,
  });

  const handleInputChange = (event) => {
    console.log("144 event.target.files >> ", event.target.files);
    console.log("145 userInfo >> ", userInfo);
    setuserInfo({
      ...userInfo,
      file: event.target.files[0],
      filepreview: URL.createObjectURL(event.target.files[0]),
    });
  }

  const handleClosee = (event) => {
    setuserInfo({
      ...userInfo,
      filepreview: null
    });
  }

  return (
    <React.Fragment>
      <div className="ShowCategory">
        <div class='container my-100'>
          <br/>
          <h1 class="font headsize">Category Data</h1>
          <Button
            style={{
              color: "white",
              backgroundColor: '#3d405b',
              align: "right",
              float: "right",
              marginRight: "24px",
            }}
            variant="contained"
            //onClick={handleClick}
            onClick={(e) => {
              setIsUpdate(false);
              handleClick(e);
            }}
          >
            Add category
          </Button><br/><br/>
          <Popover
            textAlign="center"
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            data-toggle="popover"
            data-placement="top"
            data-content="Content"
            anchorOrigin={{
              vertical: "center",
              horizontal: "center",
            }}
          >
            {isUpdate ?
              <div className="teacher card">
                <div className="card-body text-left">
                  <p className="card-text">Id: {category.id}</p>
                  <p className="card-text">Type: {category.type}</p>
                  <div className="d-flex">
                    <input
                      className="form-control"
                      style={{ width: "300px" }}
                      type="text"
                      defaultValue={category.type}
                      onChange={(event) => {
                        setNewName(event.target.value);
                      }}
                    />
                  </div><br />
                  <div className="form-mb-3 text-left">
                    <label className="card-text">Select Image : {category.image}</label><br /><br />
                    <input type="file" className="form-control" name="upload_file" onChange={handleInputChange} />
                  </div><br />

                  {userInfo.filepreview !== null ?
                    <img
                      className="previewimg"
                      src={userInfo.filepreview}
                      alt="UploadImage"
                      style={{ "height": "70px", "width": "130px", "textAlign": "right" }}
                    />
                    : null}

                  <div className="d-flex">
                    &nbsp;&nbsp;&nbsp;
                    <div className="card-body text-center">
                      <button
                        className="btn btn-warning"
                        onClick={(e) => {
                          if (newName.length === 0) {
                            // console.log("newNameee", newName.length)
                            // console.log("test1")
                            setNewName(category.type)
                            updateClick(category.id, category.type)
                          } else if (newName.length === 0 && userInfo.file.length > 0) {
                            console.log("test2")
                            setNewName(category.type)
                            updateClick(category.id, category.type)
                          } else {
                            console.log("test3")
                            updateCategory(category.id);
                          }
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
              <Typography sx={{ p: 25 }} textAlign="center">
                <form action="">
                  <div className="mb-3 text-left">
                    <label className="form-label" htmlFor="name">
                      Category Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter name"
                      onChange={(event) => {
                        setTypeName(event.target.value);
                      }}
                    />
                    <div className="form-mb-3 text-center">
                      <label className="text-white">Select Image :</label>
                      <input type="file" className="form-control" name="upload_file" onChange={handleInputChange} />
                    </div><br />
                    {userInfo.filepreview !== null ?
                      <img className="previewimg"
                        src={userInfo.filepreview}
                        alt="UploadImage"
                        style={{ "height": "70px", "width": "130px", "textAlign": "right" }}
                      />
                      : null}
                  </div>
                  <div>
                    <button className="btn btn-success"
                      onClick={(event) => {
                        addCategory();
                      }}
                    >
                      Save
                    </button><br />
                  </div>
                </form>
              </Typography>
            }
          </Popover>
          <div class='container mt-10'>
            <div class='container my-40'>
              <TableContainer component={Paper} style={{ padding: "0px", backgroundColor: '#f8edeb' }}>
                <Table sx={{ minWidth: 500 }} aria-label="customized table" >
                  <TableHead >
                    <TableRow >
                      <StyledTableCell align="center" fontSize="large" style={{ padding: "20px", backgroundColor: '#81b29a', color: 'black' }} >
                        ID
                      </StyledTableCell>
                      <StyledTableCell align="center" fontSize="large" style={{ padding: "20px", backgroundColor: '#81b29a', color: 'black' }}>CATEGORY NAME</StyledTableCell>
                      <StyledTableCell align="center" fontSize="large" style={{ padding: "20px", backgroundColor: '#81b29a', color: 'black' }}>STATUS</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoryList.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row" align="center">
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.type}
                        </StyledTableCell>
                        <br />
                        <button
                          className="btn btn-danger"
                          align="center"
                          onClick={() => {
                            deleteCategory(row.id);
                          }}
                        >
                          Delete
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        <button
                          className="btn btn-warning"
                          // onClick={handleClickk}
                          onClick={(e) => {
                            setIsUpdate(true);
                            handleUpdate(row.id);
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
        </div>
      </div>
    </React.Fragment>
  );
};

export default ShowCategory;
