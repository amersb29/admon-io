<script>
export default {
    computed: {
        name: {
            get () {
                return this.$store.getters.name
            },
            set (value) {
                this.$store.commit('updateName', value)
            }
        },
        description: {
            get () {
                return this.$store.getters.description
            },
            set (value) {
                this.$store.commit('updateDescription', value)
            }
        },
    }
}
</script>