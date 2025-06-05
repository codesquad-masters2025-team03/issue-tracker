import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import useDataFetch from '@/hooks/useDataFetch';
import MilestoneLabelHeader from '@/units/common/MilestoneLabelHeader';
import LabelCreateForm from '@/base-ui/labelDetail/LabelCreateForm';
import LabelItem from '@/units/label/LabelItem';
import useLabelStore from '@/stores/labelStore';
import { GET_LABELS, POST_LABEL, PATCH_LABEL, DELETE_LABEL } from '@/api/labels';
import getOptionWithToken from '@/utils/getOptionWithToken/getOptionWithToken';
import { typography } from '@/styles/foundation';

export default function LabelPage() {
  const { response, fetchData } = useDataFetch({ fetchType: 'Label' });
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const labelState = useLabelStore((s) => s.labels);
  const initLabels = useLabelStore((s) => s.setLabels);
  const count = useLabelStore((s) => s.count);
  const reFetch = useRef(true);
  const accessToken = localStorage.getItem('token');

  function reFetchHandler(bool) {
    reFetch.current = bool;
  }

  useEffect(() => {
    if (!reFetch.current) return;
    fetchData(GET_LABELS, getOptionWithToken({ method: 'GET' }, accessToken));
    reFetchHandler(false);
  }, [response]);

  useEffect(() => {
    if (!response?.data) return;
    initLabels(response.data.labels, response.data.count);
  }, [response]);

  async function submitHandler({
    name,
    description,
    color,
    fetchMethod,
    setterFn = null,
    labelId = null,
  }) {
    const API = fetchMethod === 'PATCH' ? PATCH_LABEL(labelId) : POST_LABEL;
    const fetchOption = {
      method: fetchMethod,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, color }),
    };
    const { ok } = await fetchData(API, getOptionWithToken(fetchOption, accessToken));
    if (ok) {
      reFetchHandler(true);
      if (setterFn) {
        setterFn(false);
      } else {
        setIsAddTableOpen(false);
      }
    }
  }

  function deleteHandler(labelId) {
    fetchData(DELETE_LABEL(labelId), getOptionWithToken({ method: 'DELETE' }, accessToken));
    reFetchHandler(true);
  }

  return (
    <Container>
      <MilestoneLabelHeader
        isLabel={true}
        isValid={!isAddTableOpen}
        addHandler={() => setIsAddTableOpen(true)}
      />
      {isAddTableOpen && (
        <LabelCreateForm
          isAdd={true}
          onCancel={() => setIsAddTableOpen(false)}
          onSubmit={(data) => submitHandler({ ...data, fetchMethod: 'POST' })}
        />
      )}
      <LabelList>
        <LabelListHeader>
          <span>전체 레이블 {count}개</span>
        </LabelListHeader>
        {labelState?.map((label) => (
          <LabelItem
            key={label.id}
            labelObj={label}
            submitHandler={submitHandler}
            deleteHandler={deleteHandler}
          />
        ))}
      </LabelList>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px 80px;
`;

const LabelList = styled.div`
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: 16px;
  margin-top: 16px;
  overflow: hidden;
`;

const LabelListHeader = styled.div`
  ${typography.display.bold16}
  padding: 20px 32px;
  border-bottom: 1px solid ${({ theme }) => theme.border.default};
  color: ${({ theme }) => theme.text.default};
  background: ${({ theme }) => theme.surface.bold};
`;
