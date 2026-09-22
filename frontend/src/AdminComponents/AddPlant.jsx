import  { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import './AddPlant.css';

import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';
import imageCompression from 'browser-image-compression';

function AddPlant() {
  const navigation = useNavigate();
  const url = `${API_BASE_URL}/plants`;
  const token = localStorage.getItem("Token");
  // console.log(typeof token);
  const resetObj = {
    plantName: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    category: '',
    coverImage: ''
  };

  const [formData, setFormData] = useState(resetObj);
  const [successMsg, updateSuccMsg] = useState(false);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchPlant = async () => {
    try {
      const res = await axios.get(`${url}/getPlantById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFormData(res.data);
    } catch (err) {

      navigation('/Components/ErrorPage')
    }
  };

  useEffect(() => {
    if (id) {
      fetchPlant();
    }
  }, [id]);

  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (file) {
        try {
          const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 800,
            useWebWorker: true,
          };
          const compressedFile = await imageCompression(file, options);
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData((prev) => ({
              ...prev,
              coverImage: reader.result,
            }));
          };
          reader.readAsDataURL(compressedFile);
        } catch (error) {
          console.error('Image compression error:', error);
        }
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.plantName) newErrors.name = "*Plant Name is required";
    if (!formData.description) newErrors.description = "*Description is required";
    if (!formData.price || +(formData.price) <= 0) newErrors.price = "*Price is required";
    if (!formData.stockQuantity || +(formData.stockQuantity) <= 0) newErrors.stock = "*Stock Quantity is required";
    if (!formData.category) newErrors.category = "*Category is required";
    if (!formData.coverImage) newErrors.image = "*Cover Image is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (id) {
        await axios.put(`${url}/updatePlant/${id}`, { ...formData }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        updateSuccMsg(true);
        setFormData(resetObj);
        setErrors({});
        setTimeout(() => navigate('/AdminComponents/ViewPlant'), 2000);
      } else {
        console.log(formData)

        await axios.post(`${url}/addplant`, { ...formData }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        updateSuccMsg(true);
        setFormData(resetObj);
      }
    } catch (err) {
      // console.error(err);
      navigation('/Components/ErrorPage')
    }
  };

  function okButton() {
    updateSuccMsg(false);
  }

  function onBack() {
    navigate('/AdminComponents/ViewPlant');
  }

  return (
    <>
      <AdminNavbar />
      <div className='fullPage'>
        <div className='page-container'>
          <form className='addPlantForm' onSubmit={handleSubmit}>
            {id && <button onClick={onBack} className='backBtn'>Back</button>}
            <h1 className='h1'>{id ? "Edit" : "Add New"} Plant</h1>
            <hr className='hr-line' />

            <label htmlFor='name'>Plant Name<span className='asterik'>*</span></label><br />
            <input
              id='name'
              name='plantName'
              value={formData.plantName}
              onChange={handleChange}
            /><br />
            {errors.name && <p className='error'>{errors.name}</p>}<br />

            <label htmlFor='description'>Description<span className='asterik'>*</span></label><br />
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
            ></textarea><br />
            {errors.description && <p className='error'>{errors.description}</p>}<br />

            <label htmlFor='price'>Price<span className='asterik'>*</span></label><br />
            <input
              id='price'
              name='price'
              type='number'
              value={formData.price}
              onChange={handleChange}
            /><br />
            {errors.price && <p className='error'>{errors.price}</p>}<br />

            <label htmlFor='stock'>Stock Quantity<span className='asterik'>*</span></label><br />
            <input
              id='stock'
              name='stockQuantity'
              type='number'
              value={formData.stockQuantity}
              onChange={handleChange}
            /><br />
            {errors.stock && <p className='error'>{errors.stock}</p>}<br />

            <label htmlFor='category'>Category<span className='asterik'>*</span></label><br />
            <select
              id='category'
              name='category'
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Fruits">Fruits</option>
              <option value="Bonsai">Bonsai</option>
              <option value="Flowers">Flowers</option>
              <option value="Vegetables">Vegetables</option>
              <option value="ShowPlant">ShowPlant</option>
            </select><br />
            {errors.category && <p className='error'>{errors.category}</p>}<br />

            <label htmlFor='image'>Cover Image<span className='asterik'>*</span></label><br />
            <input
              type='file'
              name='coverImage'
              accept='image/*'
              onChange={handleChange}
            /><br />
            {errors.image && <p className='error'>{errors.image}</p>}<br />
            {formData.coverImage && <img src={formData.coverImage} alt='Preview' style={{ width: "100px", height: "100px" }} />}

            <button type='submit' className='submit-btn'>{id ? "Update" : "Add"} Plant</button>
          </form>
        </div>

        {successMsg &&
          (<div className='succDiv'>
            <div className='succPopup'>
              <p><strong>Plant {id ? "Updated" : "Added"} Successfully!</strong></p>
              <button onClick={okButton} className='submit-btn'>Ok</button>
            </div>
          </div>)
        }
      </div>
    </>
  );
}

export default AddPlant;

