import React from 'react'
import styled, { keyframes } from 'styled-components'

const loading = keyframes`
	0% {
	  opacity: 0;
	}
	100% {
	  opacity: 1;
	}
`


const Container = styled.div`
	width: 100%;
	height: 100%;
  	display: ${({show}) => show ? 'block' : 'none'};
	position: relative;
	background-color: rgba(0,0,0,.2);
	.loading{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		h3{
			font-weight: 600;
		}
		span{
			display: inline-block;
			vertical-align: middle;
			width: .6em;
			height: .6em;
			margin: .19em;
			background: #007DB6;
			border-radius: .6em;
			animation: ${loading} .5s infinite alternate;
			&:nth-of-type(2) {
				background: #008FB2;
				animation-delay: 0.1s;
			}
			&:nth-of-type(3) {
				background: #009B9E;
				animation-delay: 0.2s;
			}
			&:nth-of-type(4) {
				background: #00A77D;
				animation-delay: 0.3s;
			}
			&:nth-of-type(5) {
				background: #00B247;
				animation-delay: 0.4s;
			}
		}
	}

`

function Loading(props) {
	const { label } = props
	return (
		<Container {...props} >
			<div className="loading">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<h3>{label ? label : '数据加载中'}</h3>
			</div>
		</Container>
	)
}

export default React.memo(Loading)