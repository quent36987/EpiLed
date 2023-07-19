<script lang="ts">
    import { onMount } from "svelte";
    import type { AuthSession } from "@supabase/supabase-js";
    import {supabase} from "../../../supabaseClient";
    import Avatar from "$lib/components/Profile/Avatar.svelte";
    export let session: AuthSession;

    let loading = false
    let username: string | null = null
    let website: string | null = null
    let avatarUrl: string | null = null

    onMount(() => {
        getProfile()
    })

    const getProfile = async () => {
        try {
            loading = true
            const { user } = session

            const { data, error, status } = await supabase
                .from('profiles')
                .select('username, website, avatar_url')
                .eq('id', user.id)
                .single()

            if (error && status !== 406) throw error

            if (data) {
                username = data.username
                website = data.website
                avatarUrl = data.avatar_url
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            }
        } finally {
            loading = false
        }
    }

    const updateProfile = async () => {
        try {
            loading = true
            const { user } = session

            const updates = {
                id: user.id,
                username,
                website,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            }

            let { error } = await supabase.from('profiles').upsert(updates)

            if (error) {
                throw error
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            }
        } finally {
            loading = false
        }
    }
</script>

<form on:submit|preventDefault={updateProfile} class="form">
    <div class="title">Profile</div>
    <div class="email">Email: {session.user.email}</div>
    <Avatar bind:url="{avatarUrl}" size="{150}" on:upload="{updateProfile}" />
    <div>
        <label for="username">Name</label>
        <input id="username" type="text" bind:value={username} />
    </div>
    <div>
        <label for="website">Website</label>
        <input id="website" type="text" bind:value={website} />
    </div>
    <div>
        <button type="submit" class="button primary block" disabled={loading}>
            {loading ? 'Saving ...' : 'Update profile'}
        </button>
    </div>
</form>

<style>
    .form{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 2rem;
    }

    .title{
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    .email{
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin: 5px 0;
        font-size: 0.8rem;
        text-transform: uppercase;
    }

    input {
        width: 100%;
        border-radius: 5px;
        border: #4075a6 1px solid;
        padding: 8px;
        font-size: 0.9rem;
        min-width: 300px
    }

    button,
    .button {
        margin-top: var(--spacing-m);
        color: #dddddd;
        border: 1px solid #dddddd;
        background-color: #4075a6;
        display: inline-block;
        text-align: center;
        border-radius: 5px;
        padding: 0.5rem 1rem;
        cursor: pointer;
        text-align: center;
        font-size: 0.9rem;
        text-transform: uppercase;
    }

</style>
