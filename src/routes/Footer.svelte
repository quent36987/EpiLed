<script>
    import {Footer, FooterCopyright, FooterIcon, FooterLink, FooterLinkGroup} from "flowbite-svelte";
    import {GithubOutlined} from "svelte-ant-design-icons";
</script>

<div id="footer">
    <Footer style="width: 100%; display: flex; justify-content: space-between;">
        <div>
            <FooterCopyright href="/" by="Flowbite™" year={2022} />
        </div>

        <div>
            <FooterLinkGroup
                    ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0"
            >
                <FooterLink href="/">About</FooterLink>
                <FooterLink href="/">Privacy Policy</FooterLink>
                <FooterLink href="/">Licensing</FooterLink>
                <FooterLink href="/">Contact</FooterLink>
            </FooterLinkGroup>
        </div>

        <div>
            <FooterIcon href="/">
                <GithubOutlined class="w-5 h-5 mr-1" />
            </FooterIcon>
        </div>
    </Footer>
</div>

<style>
    #footer {
        background-color: #eee;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 30px 5px;
        height: 60px;
    }
</style>
