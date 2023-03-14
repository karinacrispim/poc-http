import { dehydrate, QueryClient, useQuery } from "react-query";
import { useState } from "react";

import { ResponseError, Loading, ProvidersResponse } from "./types";
import { api } from "./../api/";
import styles from "./styles.module.css";

const itemsPerPage = 8;

const getHospitals = async (page = 1) => {
  const rangeEnd = page === 1 ? itemsPerPage : page * itemsPerPage;
  const rangeStart = page === 1 ? 0 : rangeEnd - itemsPerPage;

  const { data, headers } = await api.get(
    `health_community/hospitals?range=[${rangeStart},${rangeEnd}]&filter={productType=B2C}`
  );

  const response: ProvidersResponse = {
    providers: data,
    totalOfProviders: headers["content-range"],
  };
  return response;
};

const Loading = ({ isLoading }: Loading) =>
  isLoading ? <div className={styles.content}>Loading...</div> : null;

const Error = ({ error }: ResponseError) =>
  error ? <div className={styles.content}>Erro: {error.message} </div> : null;

export default function HealthComunnityList() {
  const [page, setPage] = useState(1);

  const { isLoading, error, data, isFetching, isPreviousData, isSuccess } =
    useQuery<ProvidersResponse, Error>(
      ["healthCommunity", "hospitals", "list", page],
      () => getHospitals(page),
      {
        keepPreviousData: true,
      }
    );

  const hasMore = () => {
    const total = data?.totalOfProviders;
    if (total === undefined) return false;

    const numberOfPages = Math.ceil(total / itemsPerPage);
    return page + 1 === numberOfPages;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de hospitais</h1>
      
      <Loading isLoading={isLoading} />
      <Error error={error} />
      
      {isSuccess && (
        <div className={styles.list}>
          {data?.providers.map(provider => (
            <p key={provider.urlSlug}>
              {provider.name}
            </p>
          ))}
        </div>
      )}

      <div>
        <span>Current Page: {page}</span>
        <button onClick={() => setPage(old => old - 1)} disabled={page === 1}>
          Previous Page
        </button>{" "}
        <button
          onClick={() => {
            if (!isPreviousData && hasMore()) {
              setPage(old => old + 1);
            }
          }}
          disabled={isPreviousData || !hasMore()}
        >
          Next Page
        </button>
        {isFetching ? <span> Loading...</span> : null}{" "}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    ["healthCommunity", "hospitals", "list", "1"],
    () => getHospitals()
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
