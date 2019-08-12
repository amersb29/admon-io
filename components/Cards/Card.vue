<template>
  <div class="card">
    <div class="card-image" v-if="$slots.image">
      <slot name="image"></slot>
    </div>
    <div class="card-header horizontal" v-if="$slots.header || title">
      <slot name="header">
        <section>
          <h4 class="card-title">{{title}}</h4>
          <p class="card-category" v-if="subTitle">{{subTitle}}</p>
        </section>
        <section v-if="actions">
          <ul class="card-actions" v-for="action in actions" :key="action.name">
            <li @click="emit(action.eventName)">
              <a href="#">
                <i :class="actionIcon( action.icon )"></i>
              </a>
            </li>
          </ul>
        </section>
      </slot>
    </div>
    <div class="card-body" v-if="$slots.default">
      <slot></slot>
    </div>
    <slot name="raw-content"></slot>
    <div class="card-footer" v-if="$slots.footer">
      <hr>
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "card",
  props: {
    actions: Array,
    hasActions: Boolean,
    subTitle: String,
    title: String,
  },
  methods: {
    actionIcon( icon ){
      return `fa fa-${icon}`;
    },
    emit(eventName){
      this.$emit( eventName );
    }
  }
};
</script>
<style lang="scss">
  .card-title{
    font-size: 2.5rem;
  }

  .card-actions{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    line-height: 1.2em;
    list-style: none;

    li {
      // border-radius: 50%;
      height: 50px;
      // padding: 7px 15px;
      width: 50px;

      a{
        color: #229863;
        font-size: 2.5rem;
      }
    }
  }

  .horizontal{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>

