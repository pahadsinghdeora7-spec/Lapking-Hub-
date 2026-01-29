// src/pages/Signup.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Login.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    mobile: "",
    email: "",
    password: "",
    business_name: "",
    gst_number: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSignup() {
    if (!form.full_name || !form.mobile || !form.email || !form.password) {
      alert("Please fill all required fields");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    });

    if (error) {
      alert(error.message);
      return;
    }

    // ✅ save profile
    await supabase.from("user_profiles").insert({
      user_id: data.user.id,
      full_name: form.full_name,
      mobile: form.mobile,
      email: form.email,
      business_name: form.business_name,
      gst_number: form.gst_number
    });

    // redirect back to checkout if came from there
    const redirect = localStorage.getItem("redirect_after_login");
    if (redirect) {
      localStorage.removeItem("redirect_after_login");
      navigate(redirect);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2>Create your LapkingHub account</h2>

        <p className="sub-text">
          Join thousands of retailers buying laptop accessories directly
          from verified suppliers.
        </p>

        <label>Full Name *</label>
        <input name="full_name" onChange={handleChange} />

        <label>Mobile Number *</label>
        <input
          name="mobile"
          maxLength="10"
          placeholder="10 digit mobile number"
          onChange={handleChange}
        />

        <label>Email Address *</label>
        <input name="email" type="email" onChange={handleChange} />

        <label>Password *</label>
        <input
          name="password"
          type="password"
          placeholder="Minimum 6 characters"
          onChange={handleChange}
        />

        <label>Business Name (optional)</label>
        <input name="business_name" onChange={handleChange} />

        <label>GST Number (optional)</label>
        <input name="gst_number" onChange={handleChange} />

        <button onClick={handleSignup}>
          Create Business Account
        </button>

        <p className="benefits">
          ✔ Wholesale pricing <br />
          ✔ Trusted sellers <br />
          ✔ Easy replacement <br />
          ✔ Dedicated support
        </p>

        <p className="login-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  );
}
