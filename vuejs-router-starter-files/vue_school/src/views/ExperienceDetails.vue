<template>
  <div>
    <section class="experiences">
      <h1>Experience</h1>
      <h2>{{ experience.name }}</h2>
      <div class="experience-details">
        <img
          :src="require(`@/assets/${experience.image}`)"
          :alt="experience.name"
        />
        <p>{{ experience.description }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import store from "@/store";
export default {
  data() {
    return {
      // slug: this.$route.params.slug,
    };
  },
  props: {
    slug: {
      type: String,
      required: true,
    },
    experienceSlug: {
      type: String,
      required: true,
    }
  },
  computed: {
    destination() {
      return store.destinations.find((el) => el.slug === this.slug);
    },
    experience(){
      return this.destination.experiences.find((el) => el.slug === this.experienceSlug);
    }
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
.experience-details {
  display: flex;
  justify-content: space-between;
}
p {
  margin: 0 40px;
  font-size: 20px;
  text-align: left;
}
</style>