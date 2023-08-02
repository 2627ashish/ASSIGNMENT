import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://qa2.sunbasedata.com/sunbase/portal/api';
const AUTH_API_URL = `${API_BASE_URL}/assignment_auth.jsp`;

const CustomerManagement = () => {
  const [token, setToken] = useState('');
  const [customerList, setCustomerList] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    street: '',
    address: '',
    city: '',
    state: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async () => {
    const loginObj = {
      login_id: 'test@sunbasedata.com',
      password: 'Test@123',
    };

    try {
      const response = await axios.post(AUTH_API_URL, loginObj);
      const token = response.data.token;
      setToken(token);
    } catch (error) {
      console.error('Authentication failed.', error);
    }
  };

  const handleCreateCustomer = async () => {
    const createCustomerUrl = `${API_BASE_URL}/assignment.jsp?cmd=create`;
    try {
      await axios.post(createCustomerUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Customer created successfully!');
      // Refresh customer list
      await fetchCustomerList();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('First Name or Last Name is missing');
      } else {
        console.error('Error creating customer:', error);
      }
    }
  };

  const fetchCustomerList = async () => {
    const getCustomerListUrl = `${API_BASE_URL}/assignment.jsp?cmd=get_customer_list`;
    try {
      const response = await axios.get(getCustomerListUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomerList(response.data);
    } catch (error) {
      console.error('Error fetching customer list:', error);
    }
  };

  const handleDeleteCustomer = async (uuid) => {
    const deleteCustomerUrl = `${API_BASE_URL}/assignment.jsp?cmd=delete&uuid=${uuid}`;
    try {
      await axios.post(deleteCustomerUrl, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Customer deleted successfully!');
      // Refresh customer list
      await fetchCustomerList();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('UUID not found');
      } else {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleUpdateCustomer = async (uuid) => {
    const updateCustomerUrl = `${API_BASE_URL}/assignment.jsp?cmd=update&uuid=${uuid}`;
    try {
      await axios.post(updateCustomerUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Customer updated successfully!');
      // Refresh customer list
      await fetchCustomerList();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('Body is Empty');
      } else if (error.response && error.response.status === 500) {
        alert('UUID not found');
      } else {
        console.error('Error updating customer:', error);
      }
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <div>
        <h2>Create Customer</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            First Name:
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
          </label>
          <label>
            Last Name:
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
          </label>
          {/* Add other fields here */}
          <button onClick={handleCreateCustomer}>Create Customer</button>
        </form>
      </div>
      <div>
        <h2>Customer List</h2>
        <ul>
          {customerList.map((customer) => (
            <li key={customer.uuid}>
              {customer.first_name} {customer.last_name}
              <button onClick={() => handleDeleteCustomer(customer.uuid)}>Delete</button>
              <button onClick={() => handleUpdateCustomer(customer.uuid)}>Update</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomerManagement;
