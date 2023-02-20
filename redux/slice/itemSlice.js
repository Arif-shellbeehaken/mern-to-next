import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { shoppingApi } from "../../redux/services/shoppingApi";

const itemsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = itemsAdapter.getInitialState()

export const extendedApiSlice = shoppingApi.injectEndpoints({
    endpoints: builder => ({
        getItems: builder.query({
            query: () => '/api/items',
            transformResponse: responseData => {
                return itemsAdapter.setAll(initialState, responseData)
            },
            providesTags: (result, error, arg) => [
                { type: 'Item', id: "LIST" }
            ]
        }),
        getItem: builder.query({
            query: id => `/api/items?itemId=${id}`,
            transformResponse: responseData => {
                return itemsAdapter.setAll(initialState, responseData)
            },
            providesTags: (result, error, arg) => [
                { type: 'Item', id: "LIST" }
            ]
        }),
        addItem: builder.mutation({
            query: initialPost => ({
                url: '/api/items',
                method: 'POST',
                body: {
                    ...initialPost,
                }
            }),
            invalidatesTags: [
                { type: 'Item', id: "LIST" }
            ]
        }),
        // updatePost: builder.mutation({
        //     query: initialPost => ({
        //         url: `/posts/${initialPost.id}`,
        //         method: 'PUT',
        //         body: {
        //             ...initialPost,
        //             date: new Date().toISOString()
        //         }
        //     }),
        //     invalidatesTags: (result, error, arg) => [
        //         { type: 'Post', id: arg.id }
        //     ]
        // }),
        deleteItem: builder.mutation({
            query: ({ id }) => ({
                url: `/api/items/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Item', id: arg.id }
            ]
        }),
        // addReaction: builder.mutation({
        //     query: ({ postId, reactions }) => ({
        //         url: `posts/${postId}`,
        //         method: 'PATCH',
        //         // In a real app, we'd probably need to base this on user ID somehow
        //         // so that a user can't do the same reaction more than once
        //         body: { reactions }
        //     }),
        //     async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }) {
        //         // `updateQueryData` requires the endpoint name and cache key arguments,
        //         // so it knows which piece of cache state to update
        //         const patchResult = dispatch(
        //             extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {
        //                 // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
        //                 const post = draft.entities[postId]
        //                 if (post) post.reactions = reactions
        //             })
        //         )
        //         try {
        //             await queryFulfilled
        //         } catch {
        //             patchResult.undo()
        //         }
        //     }
        // })
    })
})

export const {
    useGetItemsQuery,
    useGetItemQuery,
    useAddItemMutation,
    useDeleteItemMutation,
    // useUpdatePostMutation,
    
    // useAddReactionMutation
} = extendedApiSlice



// returns the query result object
export const selectItemsResult = extendedApiSlice.endpoints.getItems.select()

// Creates memoized selector
const selectItemsData = createSelector(
    selectItemsResult,
    itemsResult => itemsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllItems,
    selectById: selectItem,
    // selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state
} = itemsAdapter.getSelectors(state => selectItemsData(state) ?? initialState)
