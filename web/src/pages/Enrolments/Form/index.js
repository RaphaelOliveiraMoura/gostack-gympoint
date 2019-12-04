import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { Form } from '@rocketseat/unform';
import { toast } from 'react-toastify';
import { parseISO, addMonths } from 'date-fns';

import {
  Container,
  ContentHeader,
  Card,
  Select,
  BackButton,
  SaveButton,
} from './styles';

import DatePicker from '~/components/Input/DatePicker';
import CurrencyInput from '~/components/Input/Currency';

import api from '~/services/api';
import history from '~/services/history';

const schema = Yup.object().shape({
  student_id: Yup.string()
    .typeError('Escolha um aluno')
    .required('Escolha um aluno válido'),
  plan_id: Yup.number()
    .typeError('Escolha um plano')
    .required('Escolha um plano válido'),
  start_date: Yup.date()
    .typeError('Digite uma data')
    .min(new Date())
    .required('Digite uma data válida'),
});

export default function FormPlans({ match }) {
  const { id } = match.params;

  const [students, setStudents] = useState([]);
  const [plans, setPlans] = useState([]);
  const [initialData, setInitialData] = useState({});

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [start_date, setStartDate] = useState(null);

  const loadStudents = useCallback(() => {
    async function load() {
      const response = await api.get('/students');
      const data = response.data.map(student => ({
        id: student.id,
        title: student.name,
        data: student,
      }));
      setStudents(data);
    }

    load();
  }, []);

  const loadPlans = useCallback(() => {
    async function load() {
      const response = await api.get('/plans');
      const data = response.data.map(plan => ({
        id: plan.id,
        title: plan.title,
        data: plan,
      }));
      setPlans(data);
    }

    load();
  }, []);

  useEffect(() => {
    async function loadEnrolment() {
      try {
        const response = await api.get(`/enrolments/${id}`);

        const { data } = response;

        setInitialData({
          student_id: data.student.id,
          plan_id: data.plan.id,
          start_date: parseISO(data.start_date),
          end_date: addMonths(parseISO(data.start_date), data.plan.duration),
          end_price: data.price,
        });
      } catch (error) {
        history.push('/enrolments/create');
      }
    }

    if (id) {
      loadEnrolment();
    }

    loadStudents();
    loadPlans();
  }, [id, loadPlans, loadStudents]);

  useEffect(() => {
    if (selectedPlan && start_date) {
      setInitialData({
        ...initialData,
        end_date: addMonths(start_date, selectedPlan.data.duration),
        end_price:
          Number(selectedPlan.data.price) * Number(selectedPlan.data.duration),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan, start_date]);

  async function handleSubmit({ student_id, plan_id }) {
    if (id) {
      try {
        await api.put(`/enrolments/${id}`, { student_id, plan_id, start_date });
        toast.success('Matrícula atualizada com sucesso');
        history.push('/enrolments');
      } catch (error) {
        toast.error('Error ao atualizar dados da matrícula');
      }
    } else {
      try {
        await api.post('/enrolments', { student_id, plan_id, start_date });
        toast.success('Matrícula realizada');
        history.push('/enrolments');
      } catch (error) {
        toast.error('Error ao realizar matrícula');
      }
    }
  }

  return (
    <Container>
      <Form
        schema={schema}
        onSubmit={handleSubmit}
        initialData={initialData}
        context={{ start_date }}
      >
        <ContentHeader>
          <h1>{id ? 'Edição de matrícula' : 'Cadastro de matrícula'}</h1>
          <div className="options">
            <Link to="/enrolments">
              <BackButton background="#ccc" type="button">
                VOLTAR
              </BackButton>
            </Link>
            <SaveButton type="submit">SALVAR</SaveButton>
          </div>
        </ContentHeader>
        <Card>
          <Select
            name="student_id"
            label="ALUNO"
            placeholder="Buscar aluno"
            options={students}
          />
          <Select
            name="plan_id"
            placeholder="Selecione o plano"
            label="PLANO"
            options={plans}
            onChange={plan => setSelectedPlan(plan)}
          />
          <DatePicker
            name="start_date"
            placeholder="Escolha a data"
            label="DATA DE INÍCIO"
            minDate={new Date()}
            onChange={date => setStartDate(date)}
          />
          <DatePicker name="end_date" label="DATA DE TÉRMINO" disabled />
          <CurrencyInput name="end_price" label="VALOR FINAL" disabled />
        </Card>
      </Form>
    </Container>
  );
}

FormPlans.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

FormPlans.defaultProps = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: null,
    }),
  }),
};
