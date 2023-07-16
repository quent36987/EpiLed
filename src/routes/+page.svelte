<script>
	import shop from '../lib/images/shop.png';
	import circuit3 from '../lib/images/circuit.png';
	import test2 from '../lib/images/test2.png';
	import profile from '../lib/images/profile.png';
</script>

<div class="card-container">
	<div class="card">
		<a href="/devices">
			<img class="card-image" alt="" src={test2} />
		</a>
		<div class="content">
			<h3>My Devices</h3>
			<h2>Create your template</h2>
		</div>
	</div>
	<div class="card">
		<a href="/about"> <img class="card-image" alt="" src={circuit3} /></a>
		<div class="content">
			<h3>About</h3>
			<h2>Learn about Epi-Led</h2>
		</div>
	</div>
	<div class="card">
		<a href="/shop"> <img class="card-image" alt="" href="/" src={shop} /> </a>
		<div class="content">
			<h3>Shop</h3>
			<h2>Visite EpiLed shop</h2>
		</div>
	</div>
	<div class="card">
		<a href="/login"> <img class="card-image" alt="" href="/" src={profile} /> </a>
		<div class="content">
			<h3>Profile</h3>
			<h2>Create your Account</h2>
		</div>
	</div>
</div>

<style>
	.card-image {
		display: flex;
		border-radius: 8px;
		text-decoration: none;
		min-width: 300px;
		min-height: 20rem;
		background-size: cover;
		box-sizing: border-box;
		background: linear-gradient(135deg, #1e5799 0%, #2989d8 0%, #d9e0ea 0%, #829bba 100%);
		font-family: 'Poppins', serif;
	}

	.card-container {
		width: 100%;
		height: 100%;
		margin: 0 auto;
		display: flex;
		flex-flow: row wrap;
		justify-content: space-evenly;
	}
	.card {
		top: 0;
		width: 300px;
		height: 480px;
		border-radius: 8px;
		align-self: center;
		display: flex;
		position: relative;
		cursor: pointer;
		transition: all 0.25s ease-in-out;
	}
	.card:after {
		content: '';
		display: block;
		height: 40px;
		width: 80%;
		bottom: -16px;
		background-color: rgba(95, 124, 164, 0.8);
		position: absolute;
		z-index: -1;
		left: 50%;
		margin-left: -40%;
		transform: perspective(200px) rotateX(45deg);
		filter: blur(10px);
		transition: all 0.3s ease-in-out;
	}
	.card:hover {
		top: -10px;
	}
	.card:hover:after {
		bottom: -20px;
		filter: blur(14px);
	}
	.card img {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 0;
		display: block;
		vertical-align: middle;
		-o-object-fit: cover;
		object-fit: cover;
		-o-object-position: center center;
		object-position: center center;
		-webkit-backface-visibility: hidden;
	}
	.card .content {
		position: absolute;
		bottom: 0;
		padding: 0 2rem;
		z-index: 1;
		align-self: flex-end;
		text-align: center;
		margin: 0 auto 2.25rem auto;
	}
	.card .content h2,
	.card .content h3 {
		color: #fff;
		text-align: center;
		font-weight: 400;
	}
	.card .content h3 {
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.05rem;
		position: relative;
		margin: auto;
		padding: 0 15px;
		display: inline-block;
	}
	.card .content h3:before,
	.card .content h3:after {
		content: '';
		display: block;
		height: 1px;
		background-color: rgba(255, 255, 255, 0.7);
		width: 50px;
		position: absolute;
		margin: 0 auto;
		top: 4px;
		right: 100%;
	}
	.card .content h3:after {
		left: 100%;
	}
	.card .content h2 {
		color: #fff;
		text-align: center;
		font-size: 32px;
		padding-top: 10px;
		margin: 0;
	}
</style>
