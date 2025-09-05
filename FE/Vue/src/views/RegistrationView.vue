<template>
  <div class="registration-container">
    <form class="resgistration-form" @submit.prevent="handleSubmit">
      <h2>Register</h2>
      <BaseInput
        label="Username"
        type="text"
        v-model="username"
        id="username"
        :error="errors.username"
      />
      <BaseInput
        label="Password"
        type="password"
        v-model="password"
        id="password"
        :error="errors.password"
      />
      <div class="form-group">
        <label>Gender</label>
        <div>
          <input id="male" type="radio" v-model="gender" value="male" />
          <label for="male">Male</label>
        </div>
        <div>
          <input id="female" type="radio" v-model="gender" value="female" />
          <label for="female">Female</label>
        </div>
      </div>
      <BaseInput
        label="FullName"
        type="text"
        v-model="fullname"
        id="fullname"
        :error="errors.fullName"
      />
      <div class="form-actions">
        <button type="submit">Submit</button>
        <button type="button" @click="handleReset">Reset</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from '@/components/BaseInput.vue';

const username = ref('');
const password = ref('');
const gender = ref('male');
const fullname = ref('');
const errors = ref<{ [key: string]: string }>({});

const validate = () => {
  errors.value = {}; //Reset errors
  if (!username.value) errors.value.username = 'Username is required';
  else if (username.value.length < 3) errors.value.username = 'Username too short';

  if (!password.value) errors.value.password = 'Password is required';
  else if (password.value.length < 6) errors.value.password = 'Password too short';

  if (!fullname.value) errors.value.fullName = 'Full Name is required';
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = () => {
  if (!validate()) return;
  const formData = {
    username: username.value,
    password: password.value,
    gender: gender.value,
    fullName: fullname.value,
  };
  console.log('Form Submitted : ', formData);
};

const handleReset = () => {
  username.value = '';
  password.value = '';
  gender.value = '';
  fullname.value = '';
};
</script>

<style lang="scss" scoped>
.registration-container {
  display: flex;
  flex-direction: row;
  justify-content: center; //aligns on the main axis (default row)
  /*aligns on the opposite to the main axis (flex-direction:row --> aligns vertically | flex-direction: column --> aligns horizontally)*/
  // align-items: center;
  min-height: 100vh;
  background-color: #f4f4f9;
  font-family: sans-serif;

  .registration-form {
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 1);
    width: 100%;
    max-width: 400px;

    h2 {
      margin-top: 0;
      margin-bottom: 1.5;
      text-align: center;
    }
  }

  .form-group {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;

    label {
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    div {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;

      &[type='submit'] {
        background-color: #007bff;
        color: white;
      }
      &[type='button'] {
        background-color: #6c757d;
        color: white;
      }
    }
  }
}
</style>
