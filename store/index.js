import acts from '@/enums/actions'

export const state = () => ({
    action: 0,
    catalog: undefined,
    document: undefined,
    fileList: [],
    image: undefined,
    mutation: undefined,
    query: undefined,
    selectedItem: {},
})

export const mutations = {
    changeAction(state, newAction) {
        state.action = newAction
    },
    changeSelectedItem(state, selectedItem) {
        state.selectedItem = selectedItem
    },
    changeCatalog(state, catalog){
        state.catalog = catalog
    },
    changeQuery(state, query){
        state.query = query
    },
    changeMutation(state, mutation){
        state.mutation = mutation
    },
    updateName(state, value){
        state.selectedItem.name = value
    },
    updateDescription(state, value){
        state.selectedItem.description = value
    },
    updateImage(state, image){
        state.image = image
    },
    updateDocument(state, doc){
        state.document = doc
    },
    addVideo(state, video){
        state.selectedItem.videos.push( video )
    },
    updateVideo(state, {index, value}) {
        state.selectedItem.videos[index].vimeo_id = value
    },
    setVideoAsPreview(state, idx) {
        state.selectedItem.videos[idx].is_preview = 1
    },
    setVideoName(state, {idx, newName}){
        delete state.selectedItem.videos[idx].__typename
        state.selectedItem.videos[idx].name = newName
    },
    updateVideoList(state, videoList) {
        state.selectedItem.videos = videoList
    },
    addFile(state, {idx, file}) {
        state.fileList.splice(idx, 1, file)
    },
    updateTipoProducto(state, id){
        state.selectedItem.tipoProducto = {id}
    }
}

export const getters = {
    selectedItemId: state => state.selectedItem ? state.selectedItem.id : -1,
    tipoProductoId: state => state.selectedItem ? state.selectedItem.tipoProducto.id : 1,
    videos: state => state.selectedItem.videos ? state.selectedItem.videos.filter( video => video.vimeo_id !== null) : [],
    videosLength: state => state.selectedItem ? state.selectedItem.videos.length : 0,
    catalogId: state => state.catalog ? state.catalog.id : undefined ,
    vimeoId: state => idx => state.selectedItem.videos[idx].vimeo_id,
    fileList: state => state.fileList ? state.fileList : [],
    docName: state => state.document ? state.document.name : undefined,
    imageName: state => state.image ? state.image.name : undefined,
    mutation: state => state.mutation ? state.mutation : undefined,

    query: state => state.query ? state.query : undefined,
    // mutation_variables: null,
}

export const actions = {
    // executeMutation({ getters }) {
    //     this.$apollo.mutate({
    //         mutation: getters.mutation,
    //         variables: getters.mutation_variables,
    //         update: this.updateCache
    //     }).then((data) => {                
    //         let mixin = this.$swal.mixin({
    //             toast: true,
    //             position: 'top-end',
    //             showConfirmButton: false,
    //             timer: 4000,
    //             timerProgressBar: true,
    //         })

    //         mixin.fire(this.getMessage(this.catalogo), '', 'success')

    //         this.resetSelectedItem()
    //     }).catch((error) => {
    //         // console.log("ERROR", error)
    //     })
    // },
    manageAction({state, commit}, {action, mutation, selectedItem}){
        commit('changeAction', action)
        commit('changeMutation', mutation)
        commit('changeSelectedItem', selectedItem)
    },
    manageFile({state, commit}, file){
        let idx = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file.name) ? 0 : 1
        commit('addFile', {idx, file})
    },
    updateVideoProps({commit}, {idx, name}){
        let suffix = idx === 0 ? ' - Preview' : ` - Video ${idx}` 
        let newName = `${name} ${suffix}` 
        
        if( idx === 0 ) {
            commit('setVideoAsPreview', idx)
        }
        
        commit('setVideoName', {idx, newName})
    },
    updateCache( { state, getters } , { store, res } ){
        const query = {query: state.query };

        const data = store.readQuery( query )

        if(state.action === acts.CREATE){
            data[ getters.catalogId ].push(res)
        }

        if(state.action === acts.DELETE){
            let index = data[ getters.catalogId ].findIndex( obj => obj.id === res.id )
            data[ getters.catalogId ].splice(index, 1)
        }

        // Write back to the cache
        store.writeQuery({
            ...query,
            data,
        })
    }
}