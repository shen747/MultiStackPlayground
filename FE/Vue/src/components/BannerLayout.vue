<template>
  <div class="banner-container">
    <div class="banner-item">
      <h3>Banner 1</h3>
      <p>Content for the first Banner</p>
    </div>
    <div class="banner-item">
      <h3>Banner 2</h3>
      <p>Content for the second Banner</p>
    </div>
    <div class="banner-item">
      <h3>Banner 3</h3>
      <p>Content for the third Banner</p>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.banner-container {
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 1.5rem;
  margin-bottom: 2rem;
  .banner-item {
    flex: 1;
    background-color: beige;
    padding: 1.5rem;
    border: 1px solid #dee2e6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
}

@media (max-width: 768px) {
  .banner-container {
    flex-direction: column;
  }
}
</style>
