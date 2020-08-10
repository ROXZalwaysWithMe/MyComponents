import styled from 'styled-components';

export const Container = styled.div`
    height: ${({ tableHeight }) => tableHeight};
    display: ${({ tableHeight }) => (tableHeight !== void 0 ? 'flex' : 'block')};
    flex-direction: column;
    position: relative;
    background-color: var(--logo-bgcolor);
`;

export const HeaderContainer = styled.div`
    flex-shrink: 0;
    box-sizing: border-box;
    padding-right: ${({hasGutter}) => hasGutter ? '17px' : 0}
    >table{
        table-layout: fixed;
        border-collapse: collapse;
        width: ${({ tableWidth }) => (tableWidth ? `${tableWidth}px` : '100%')};
        color: #fff;
    }
    overflow-x: auto;
    overflow-y: visible;
    &::-webkit-scrollbar{
        height: 0
    }
`;

export const BodyContainer = styled.div`
    background-color: #fff;
    flex-grow: 1;
    >table{
        table-layout: fixed;
        border-collapse: collapse;
        width: ${({ tableWidth }) => (tableWidth ? `${tableWidth}px` : '100%')};
        tr:nth-child(even){
            background-color: rgba(0,0,0,.05)
        } 
    }
    overflow: auto;
`;

export const TablePagination = styled.div`
    flex-shrink: 0;
    background-color: #eee;
    display: ${({hidden}) => hidden ? 'none' : 'flex'};
    justify-content: center;
    box-sizing: border-box;
    box-shadow: 0 0 2px 1px #999;
    padding: 3px 10px;
`;

export const DTable = styled.div`
    display: table;
    table-layout: fixed;
    border-collapse: collapse;
    width: ${({ tableWidth }) => (tableWidth ? `${tableWidth}px` : '100%')};
`
export const Col = styled.div`
    display: table-column;
    width: ${({width}) => `${width}px`};
    text-align: ${({align}) => align};
`
export const Colgroup = styled.div`
    display: table-column-group;
`