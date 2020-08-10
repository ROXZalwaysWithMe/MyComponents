import React from 'react'
import styled from 'styled-components'

import Loading from 'components/Base/Loading'

const Container = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 100;
	pointer-events: all;
	display: ${({show}) => show ? 'block' : 'none'};
`

function TableLoading(props) {
	const { show }  = props

	return (
		<Container show={show}>
			<Loading show={true} />
		</Container>
	)
}

export default React.memo(TableLoading)