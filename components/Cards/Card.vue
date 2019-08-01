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
        <section>
          <ul class="card-actions" v-if="hasActions">
            <li @click="action">
              <a href="#">
                <i class="fa fa-close"></i>
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
    action: Function,
    hasActions: Boolean,
    subTitle: String,
    title: String,
  }
};
</script>
<style lang="scss">
  .card-actions{
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    list-style: none;

    li {
      border-radius: 50%;
      height: 50px;
      padding: 7px 15px;
      width: 50px;

      a{
        font-size: 1.5rem;
      }
    }
  }

  .horizontal{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>

