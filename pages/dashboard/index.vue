<template>
    <b-form>
        <b-form-file v-model="file"
                     :state="Boolean(file)"
                     drop-placeholder="Drop file here..."
                     placeholder="Choose a file or drop it here...">
        </b-form-file>
        <div class="mt-3"> Selected file: {{ file? file.name : '' }}</div>
        <b-button @click="upload()">Subir archivo</b-button>
    </b-form>
</template>

<script>
import gql from 'graphql-tag'

export default {
    layout: 'dashboard/DashboardLayout',
    data() {
        return {
            file: null,
        }
    },
    methods: {
        upload() {
            this.$apollo.mutate({
                mutation: gql`
                    mutation(
                        $file: Upload!){
                        upload(
                            image: $file
                        )
                    }
                `,
                variables: {file: this.file, fileName: this.file.name},
            }).then( data => console.log(data))
              .catch( err => console.log(err))
        }
    }
}
</script>

<style>

</style>