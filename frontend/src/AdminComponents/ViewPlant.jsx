import React, { useEffect, useState } from 'react'
import AdminNavbar from './AdminNavbar';
import './ViewPlant.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';



function ViewPlant() {

  const navigate = useNavigate();
  const navigation = useNavigate()
  const token = localStorage.getItem('Token')
  const url = `${API_BASE_URL}/plants`;
  const platntsLink = 'https://ide-fafddfed330897657cedbfbeabeone.premiumproject.examly.io/proxy/8080/plants'
  const [plantsArr, updatePlantsArr] = useState([])
  const [searchQuery, updateSearchQuery] = useState("")
  const [filterText, updateFilterText] = useState('All categories');
  const categoriesArr = ['All categories', 'Bonsai', 'Fruits','Flowers','Vegetables','ShowPlant']
  const [showModal, setShowModal] = useState(false);
  const [id, updateId] = useState(null)
  const [isLoading,updateLoadingStatus]=useState(true);


  const fetchPlants = async () => {
    try {

      const res = await axios.get(`${url}/getAllPlants`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      updatePlantsArr(res.data);
      updateLoadingStatus(false);
      // console.log(plantsArr)
    }
    catch (err) {
      navigation('/Components/ErrorPage')
    }
  }
  useEffect(() => {
    fetchPlants();
  }, [])

  //For Pagenation
  useEffect(() => {
    updateCurrPage(1);
  }, [searchQuery, filterText])

  function handleEdit(id) {
    navigate(`/AdminComponents/AddPlant/${id}`);

  }
  const handleDeleteClick = (id) => {
    updateId(id)
    setShowModal(true);
  }
  const confirmDelete = () => {
    setShowModal(false);
    axios.delete(`${url}/deletePlant/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        updateId(null)
        fetchPlants();
        alert('Plant Deleted');
      })
      .catch((err) => {
        navigation('/Components/ErrorPage')
      })

  };
  const cancelDelete = () => {
    updateId(null);
    setShowModal(false);
  };

  const searchResultArr = searchQuery === "" ? plantsArr : plantsArr.filter((plant) => plant.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredArr = filterText === "All categories" ? searchResultArr : searchResultArr.filter((plant) => plant.category === filterText);

  const plantsPerPage = 2;
  let total = Math.ceil(filteredArr.length / plantsPerPage);
  const [currPage, updateCurrPage] = useState(1);
  let last = currPage * plantsPerPage;
  let first = last - plantsPerPage;

  const slicedArr = filteredArr.slice(first, last);

  function handlePrev() {
    updateCurrPage(currPage - 1);
  }
  function handleNext() {
    updateCurrPage(currPage + 1);
  }
  return (
    <>
      <AdminNavbar />
      <div className='fullpage'>
        <h1 className='heading'>🌿Manage Plants</h1>
        <hr></hr>
        <div className='filter-section'>
          <input type='text' placeholder='🔍Search Plants' value={searchQuery} onChange={(e) => { updateSearchQuery(e.target.value) }} />
          <select value={filterText} onChange={(e) => { updateFilterText(e.target.value) }}>
            {categoriesArr.map((category) => (
              <option value={category}>{category}</option>
            ))}
          </select>
        </div>
        {isLoading&&<div className='initial-loading'>
                <p>Loading.... please wait</p>
        </div>}
        <section className='cardsPlacing'>
          {slicedArr.length === 0 ? (<p>No Plants are added</p>) : (
            slicedArr.map((obj) => {
              return (
                <div className='card' key={obj._id}>
                  <img src={obj.coverImage} alt="plantImage" style={{ width: '200', height: '200px' }} />
                  <h3>{obj.plantName}</h3>
                  <p>{obj.description}</p>
                  <p>💰Price:${obj.price}</p>
                  <p>🏷️Stock:{obj.stockQuantity}</p>
                  <p>📂Category:{obj.category}</p>
                  <button className='edt-button' onClick={() => { handleEdit(obj._id) }}>✏️Edit</button>
                  <button className='del-btn' onClick={() => { handleDeleteClick(obj._id) }}>🗑️Delete</button>
                </div>)
            })
          )}
          <div className='navigation-section'>
            <button onClick={handlePrev} disabled={!first}>⬅️Previous</button>
            <span>Page {slicedArr.length !== 0 ? currPage : 0} of {total}</span>
            <button onClick={handleNext} disabled={currPage === total}>Next➡️</button>
          </div>
        </section>
        {showModal && (
          <div className='popup-overlay'>
            <div className='popup-content'>
              <p>⚠️ Are you sure you want to delete this plant?</p>
              <div className='modal-buttons'>
                <button className='confirm-btn' onClick={confirmDelete}>Yes,Delete</button>
                <button className='cancel-btn' onClick={cancelDelete}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ViewPlant
