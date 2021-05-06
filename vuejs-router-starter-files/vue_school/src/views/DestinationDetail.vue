<template>
  <div>
    <p>{{ this.$route.params.id }}</p>
    <section class="destination">
      <h1>{{ destination.name }}</h1>
      <div class="destination-details">
        <img
          :src="require(`@/assets/${destination.image}`)"
          :alt="destination.name"
        />
        <p>{{ destination.description }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import store from "@/store";
export default {
  data() {
    return {
      sl: this.$route.params.slug,
    };
  },
  computed: {
    destination() {
      return store.destinations.find((el) => el.sl === this.sl);
    },
  },
};
</script>

<style scoped>
img {
  max-width: 600px;
  height: auto;
  width: 100%;
  max-height: 400px;
}
.destination-details {
  display: flex;
  justify-content: space-between;
}
p {
  margin: 0 40px;
  font-size: 20px;
  text-align: left;
}
</style>