<script lang="ts">
    import {supabase} from "../../../supabaseClient";

    let loading = false
    let email = ''

    const handleLogin = async () => {
        if(!email) return alert('You must enter an email')

        try {
            loading = true
            const { error } = await supabase.auth.signInWithOtp({ email })
            if (error) throw error
            alert('Check your email for login link!')
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            }
        } finally {
            loading = false
        }
    }
</script>

<div class="flex-col center">
        <div class="title">Sign in via magic link with your email below</div>
        <form class="form-widget" on:submit|preventDefault="{handleLogin}">
            <div>
                <label for="email">Email</label>
                <input
                        id="email"
                        class="inputField"
                        type="email"
                        placeholder="Your email"
                        bind:value="{email}"
                />
            </div>
            <div>
                <button type="submit" class="button block" aria-live="polite" disabled="{loading}">
                    <span>{loading ? 'Loading' : 'Send magic link'}</span>
                </button>
            </div>
        </form>

</div>

<style>
    .title{
        font-size: 1.5rem;
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
