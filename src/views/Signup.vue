<template>
  <div class="signup-container">
    <main class="main-content">
      <img src="../assets/LOGO.png" alt="Logo" class="logo-astra" />

      <div class="header">
        <h2 class="title">Create your account</h2>
        <p class="subtitle">Get started with tracking your attendance.</p>
      </div>

      <div class="form-fields">
        <div class="input-wrapper">
          <span class="material-symbols-outlined input-icon">person</span>
          <input v-model="form.fullName" class="form-input" placeholder="Full Name" type="text" />
        </div>
        <div class="input-wrapper">
          <span class="material-symbols-outlined input-icon">mail</span>
          <input v-model="form.registerNumber" class="form-input" placeholder="Register Number" type="text" />
        </div>
        <div class="input-wrapper">
          <span class="material-symbols-outlined input-icon">supervisor_account</span>
          <input v-model="form.parentEmail" class="form-input" placeholder="Parent's Email" type="email" />
        </div>
        <div class="input-wrapper">
          <span class="material-symbols-outlined input-icon">lock</span>
          <input v-model="form.password" class="form-input" placeholder="Password" type="password" />
        </div>
      </div>

      <button class="signup-button" @click="signUp">
        Sign Up
      </button>

      <div class="login-link-container">
        <p class="login-link-text">
          Already have an account?
          <a class="login-link" @click="$router.push('/signin')">Log in</a>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  fullName: "",
  registerNumber: "",
  parentEmail: "",
  password: "",
  role: ""
});

const signUp = () => {
  localStorage.setItem("signupData", JSON.stringify(form));  
  router.push("/camera");
};
</script>


<style scoped>
.signup-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: #f3faff;
  overflow: hidden;
  font-family: Manrope, "Noto Sans", sans-serif;
}

.main-content {
  flex-grow: 1;
  padding: 6rem 1.5rem 2rem;
  z-index: 10;
}

.header {
  text-align: left;
  margin-bottom: 2.5rem;
}

.title {
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 900;
  color: #1e293b;
  letter-spacing: -0.025em;
}

.subtitle {
  color: #64748b;
  margin-top: 0.75rem; 
  font-size: 1rem; 
}

.form-fields > *:not(:first-child) {
  margin-top: 1.25rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.form-input {
  width: 100%;
  border-radius: 0.5rem; 
  border: 1px solid #cbd5e1;
  background-color: #ffffff; 
  padding: 1rem 1rem 1rem 3rem;
  font-size: 1rem; 
  color: #1e293b; 
}

.form-input::placeholder {
  color: #94a3b8;
}

.form-input:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 1px #0ea5e9;
}

.signup-button {
  margin-top: 2rem;
  display: flex;
  width: 100%;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background-color: #6366f1;
  padding: 1rem 0;
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  transition: all 0.2s ease-in-out;
  border: none;
}

.signup-button:hover {
  background-color: #0369a1;
}

.signup-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #f0f9ff, 0 0 0 4px #0ea5e9;
}

.login-link-container {
  margin-top: 2rem;
  text-align: center;
}

.login-link-text {
  font-size: 0.875rem;
  color: #64748b;
}

.login-link {
  color: #6366f1;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

.input-wrapper:focus-within .input-icon {
  color: #0ea5e9;
}

.logo-astra {
    height: 15rem;
    margin-left: 25%;
    width: auto;
}
</style>